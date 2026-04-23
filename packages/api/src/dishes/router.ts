import {
  deleteRating,
  getAverageRating,
  getUserRatedDishes,
  upsertRating,
} from "@api/ratings/services";
import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { RatingSchema } from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDishes } from "./services";

// Queries the AAPI 'Retrieve Dishes By Id' endpoint for a batch of dishes' info.
// Also adds the ratings from our database to the dish information.
export const getDishProcedure = publicProcedure
  .input(z.object({ ids: z.array(z.string()) }))
  .query(async ({ ctx: { db }, input }) => {
    return await getDishes(input.ids, db);
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
