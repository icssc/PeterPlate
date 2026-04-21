import {
  deleteRating,
  getAverageRating,
  getUserRatedDishes,
  upsertRating,
} from "@api/ratings/services";
import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { type InsertDish, RatingSchema } from "@peterplate/db";
import {
  type DishWithRating,
  retrieveDishesByIdResponseSchema,
} from "@peterplate/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AAPI_DINING_ROUTE } from "..";
import { upsertDishesIfMissing } from "./services";

// Queries the AAPI 'Retrieve Dishes By Id' endpoint for a batch of dishes' info.
// Also adds the ratings from our database to the dish information.
export const getDishProcedure = publicProcedure
  .input(z.object({ ids: z.array(z.string()) }))
  .query(async ({ ctx: { db }, input }) => {
    const response = await fetch(
      `${AAPI_DINING_ROUTE}/dishes/batch?ids=${input.ids.join()}`,
    );

    // Retrieve and parse data from AAPI Endpoint
    if (!response.ok) {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Could not reach AAPI endpoint.",
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
  });

const rateDishProcedure = publicProcedure
  .input(RatingSchema)
  .mutation(async ({ ctx: { db }, input }) => {
    const dish = await db.query.dishes.findFirst({
      where: (dishes, { eq }) => eq(dishes.id, input.dishId),
    });

    if (!dish)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Dish could not be found.",
      });

    await upsertRating(db, input);

    return await getAverageRating(db, input.dishId);
  });

// Gets the average rating of the dish specified.
const getAverageRatingProcedure = publicProcedure
  .input(z.object({ dishId: z.string() }))
  .query(async ({ ctx: { db }, input }) => {
    return await getAverageRating(db, input.dishId);
  });

// Gets all of the dishes rated by the user.
const getUserRatedDishesProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx: { db }, input }) => {
    try {
      const result = await getUserRatedDishes(db, input.userId);
      return result;
    } catch (error) {
      console.error("Error in getUserRatedDishesProcedure:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch rated dishes",
        cause: error,
      });
    }
  });

const deleteRatingProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      dishId: z.string(),
    }),
  )
  .mutation(async ({ ctx: { db }, input }) => {
    await deleteRating(db, input.userId, input.dishId);
    return { success: true };
  });

export const dishRouter = createTRPCRouter({
  get: getDishProcedure,
  rate: rateDishProcedure,
  getAverageRating: getAverageRatingProcedure,
  rated: getUserRatedDishesProcedure,
  deleteRating: deleteRatingProcedure,
});
