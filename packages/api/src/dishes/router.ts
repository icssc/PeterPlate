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

const getAllDishesProcedure = publicProcedure
  .input(z.object({ limit: z.number().optional().default(6) }))
  .query(async ({ ctx: { db }, input }) => {
    const dishes = await db.query.dishes.findMany({
      limit: input.limit,
      with: {
        nutritionInfo: true,
      },
    });
    return dishes;
  });

export const dishRouter = createTRPCRouter({
  get: getDishProcedure,
  getAll: getAllDishesProcedure,
  rate: rateDishProcedure,
  getAverageRating: getAverageRatingProcedure,
  rated: getUserRatedDishesProcedure,
  deleteRating: deleteRatingProcedure,
});
