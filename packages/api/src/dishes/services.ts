import type { DiningDishPayload } from "@api/dining/types";
import { upsert } from "@api/utils";
import type { Drizzle, InsertDish } from "@peterplate/db";
import { dishes } from "@peterplate/db";
import {
  type Dish,
  retrieveDishesByIdResponseSchema,
} from "@peterplate/validators";
import { TRPCError } from "@trpc/server";
import { AAPI_DINING_ROUTE } from "..";

export async function getDishesById(
  db: Drizzle,
  ids: string[],
): Promise<DiningDishPayload[]> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];

  if (uniqueIds.length === 0) return [];

  const response = await fetch(
    `${AAPI_DINING_ROUTE}/dishes/batch?ids=${uniqueIds.join()}`,
  );

  if (!response.ok) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Could not reach AAPI endpoint.",
    });
  }

  const parsedResult = retrieveDishesByIdResponseSchema.safeParse(
    await response.json(),
  );

  if (!parsedResult.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: `Could not parse dish response: ${parsedResult.error.message}`,
    });
  }

  const apiDishes = parsedResult.data.data;
  const dishesWithRatings = await db.query.dishes.findMany({
    where: (dishes, { inArray }) => inArray(dishes.id, uniqueIds),
  });

  const ratingMap = new Map(
    dishesWithRatings.map((dish) => [
      dish.id,
      {
        totalRating: dish.totalRating,
        numRatings: dish.numRatings,
      },
    ]),
  );

  return apiDishes.map((apiDish) =>
    mapDish(apiDish, ratingMap.get(apiDish.id)),
  );
}

export async function upsertDish(
  db: Drizzle,
  dishData: InsertDish,
): Promise<InsertDish> {
  try {
    const result = await db.transaction<Omit<InsertDish, "stationId">>(
      async (tx) => {
        const upsertedDish = await upsert(tx, dishes, dishData, {
          target: [dishes.id],
        });
        return upsertedDish;
      },
    );
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

function mapDish(
  apiDish: Dish,
  ratingData?: { totalRating: number; numRatings: number },
): DiningDishPayload {
  return {
    ...apiDish,
    totalRating: ratingData?.totalRating ?? 0,
    numRatings: ratingData?.numRatings ?? 0,
  };
}
