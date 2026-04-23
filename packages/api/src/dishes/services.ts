import type { InsertDish } from "@peterplate/db";
import { type Drizzle, dishes } from "@peterplate/db";
import {
  type DishWithRating,
  retrieveDishesByIdResponseSchema,
} from "@peterplate/validators";
import { TRPCError } from "@trpc/server";
import { AAPI_DINING_ROUTE } from "..";

export async function upsertDishesIfMissing(
  db: Drizzle,
  dishData: InsertDish[],
): Promise<InsertDish[]> {
  if (dishData.length === 0) return [];

  try {
    const results = db
      .insert(dishes)
      .values(dishData)
      .onConflictDoNothing()
      .returning();
    return results;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getDishes(ids: string[], db: Drizzle) {
  const response = await fetch(
    `${AAPI_DINING_ROUTE}/dishes/batch?ids=${ids.join()}`,
  );

  // Retrieve and parse data from AAPI Endpoint
  if (!response.ok) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Could not reach AAPI dishes endpoint.",
    });
  }

  const result = await response.json();
  const parsedResult = retrieveDishesByIdResponseSchema.safeParse(result);

  if (!parsedResult.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: `Could not parse the response from retrieving dish data: ${parsedResult.error.message}`,
    });
  }

  const data = parsedResult.data.data;
  const dishIds = data.flatMap((dish) => dish.id);

  // Upsert all of the dishIds found from API, doing nothing if exists
  const upsertData = data.map(
    (dish) =>
      ({
        id: dish.id,
        numRatings: 0,
        totalRating: 0,
        createdAt: new Date(),
        updatedAt: dish.updatedAt,
      }) satisfies InsertDish,
  );
  await upsertDishesIfMissing(db, upsertData);

  // Retrieve ratings from PeterPlate database
  const dishesWithRatings = await db.query.dishes.findMany({
    where: (dishes, { inArray }) => inArray(dishes.id, dishIds),
  });

  const ratingMap = new Map(
    dishesWithRatings.map((dish) => [dish.id, dish.totalRating]),
  );

  // Merge the ratings with dish information
  const dishInfo = data.map((apiDish) => ({
    ...apiDish,
    totalRating: ratingMap.get(apiDish.id ?? null) ?? 0,
  }));

  return dishInfo as DishWithRating[];
}
