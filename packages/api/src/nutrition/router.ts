import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { z } from "zod";
import { loggedMeals, nutritionInfos } from "@zotmeal/db";
import { TRPCError } from "@trpc/server";
import { gt, eq, and, desc } from "drizzle-orm";

const LoggedMealSchema = z.object({
  dishId: z.string(),
  userId: z.string(),
  dishName: z.string(),
  servings: z.number().min(0.5, "The minimum is a half-serving"),
  eatenAt: z.date().optional(),
});

export const nutritionRouter = createTRPCRouter({
  /**
   * Log a meal to the database.
   */
  logMeal: publicProcedure
    .input(LoggedMealSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(loggedMeals)
        .values({
          userId: input.userId,
          dishId: input.dishId,
          dishName: input.dishName,
          servings: input.servings,
          eatenAt: input.eatenAt ?? new Date(), 
        })
        .returning();

      if (!result[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to log meal",
        });
      }

      return result[0];
    }),
    getMealsInLastWeek: publicProcedure
      .input(z.object({
        userId: z.string()
      }))
      .query(async ({ ctx, input }) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const meals = await ctx.db
          .select({
            // from logged_meals table
            id: loggedMeals.id,
            userId: loggedMeals.userId,
            dishId: loggedMeals.dishId,
            dishName: loggedMeals.dishName,
            eatenAt: loggedMeals.eatenAt,
            servings: loggedMeals.servings,

            // from the join on nutrition_infos table
            calories: nutritionInfos.calories,
            protein: nutritionInfos.proteinG,
            carbs: nutritionInfos.totalCarbsG,
            fat: nutritionInfos.totalFatG,
          })
          .from(loggedMeals)
          .leftJoin(nutritionInfos, eq(loggedMeals.dishId, nutritionInfos.dishId))
          .where(
            and(
              gt(loggedMeals.eatenAt, oneWeekAgo),
              eq(loggedMeals.userId, input.userId) 
            )
          )
          .orderBy(desc(loggedMeals.eatenAt));;

        return meals;
      }),
    deleteLoggedMeal: publicProcedure
      .input(z.object({
        userId: z.string(),
        dishId: z.string()
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db
          .delete(loggedMeals)
          .where(
            and(
              eq(loggedMeals.userId, input.userId),
              eq(loggedMeals.dishId, input.dishId)
            )
          )
          .returning();

        if (!result[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Logged meal not found",
          });
        }

        return result[0];
      })
});