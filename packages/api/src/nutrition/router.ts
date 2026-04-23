import { getDishes } from "@api/dishes/services";
import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { loggedMeals } from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { z } from "zod";

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
  updateLoggedMeal: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        servings: z.number().min(0.5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(loggedMeals)
        .set({
          servings: input.servings,
        })
        .where(eq(loggedMeals.id, input.id))
        .returning();

      if (!result[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Logged meal not found",
        });
      }

      return result[0];
    }),
  getMealsInLastWeek: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const meals = await ctx.db
        .select({
          // from logged_meals table
          id: loggedMeals.id,
          userId: loggedMeals.userId,
          dishId: loggedMeals.dishId,
          eatenAt: loggedMeals.eatenAt,
          servings: loggedMeals.servings,
        })
        .from(loggedMeals)
        .where(
          and(
            gt(loggedMeals.eatenAt, oneWeekAgo),
            eq(loggedMeals.userId, input.userId),
          ),
        )
        .orderBy(desc(loggedMeals.eatenAt));

      // Retrieve the nutrition information
      const dishIds = meals.map((meal) => meal.dishId);
      const dishInfo = await getDishes(dishIds, ctx.db);
      const infoMap = new Map(
        dishInfo.map((dish) => [dish.id, dish.nutritionInfo]),
      );

      return meals.map((meal) => {
        const nutritionInfo = infoMap.get(meal.dishId);

        return {
          ...meal,
          calories: nutritionInfo?.calories,
          protein: nutritionInfo?.proteinG,
          carbs: nutritionInfo?.totalCarbsG,
          fat: nutritionInfo?.totalFatG,
        };
      });
    }),
  deleteLoggedMeal: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(loggedMeals)
        .where(eq(loggedMeals.id, input.id))
        .returning();

      if (!result[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find logged meal.",
        });
      }

      return result[0];
    }),
});
