import {
  deleteRating,
  getAverageRating,
  getUserRatedDishes,
  getUserRating,
  upsertRating,
} from "@api/ratings/services";
import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { upsertUser } from "@api/users/services";
import { TRPCError } from "@trpc/server";
import { dishes, RatingSchema } from "@zotmeal/db";
import { z } from "zod";

const getDishProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx: { db }, input }) => {
    const dish = await db.query.dishes.findFirst({
      where: (dishes, { eq }) => eq(dishes.id, input.id),
    });

    if (!dish)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "dish not found",
      });

    return dish;
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
        message: "dish not found",
      });

    await upsertRating(db, input);

    return await getAverageRating(db, input.dishId);
  });

const getAverageRatingProcedure = publicProcedure
  .input(z.object({ dishId: z.string() }))
  .query(async ({ ctx: { db }, input }) => {
    return await getAverageRating(db, input.dishId);
  });

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
