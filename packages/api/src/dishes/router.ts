import { upsertRating, getAverageRating, getUserRating, getUserRatedDishes, deleteRating } from "@api/ratings/services";
import { upsertUser } from "@api/users/services";
import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { dishes, RatingSchema } from "@zotmeal/db";

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
    // 1. Check dish exists
    const dish = await db.query.dishes.findFirst({
      where: (dishes, { eq }) => eq(dishes.id, input.dishId),
    });

    if (!dish)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "dish not found",
      });

    // 2. Create user if they don't exist
    await upsertUser(db, { id: input.userId, name: "Anonymous" });

    // 3. Upsert the rating
    await upsertRating(db, input);

    // 4. Return the new average
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
  .input(z.object({ 
    userId: z.string(), 
    dishId: z.string() 
  }))
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