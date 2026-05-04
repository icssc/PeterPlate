import { createTRPCRouter, publicProcedure } from "@api/trpc";
import {
  loggedMeals,
  nutritionInfos,
  userGoals,
  userGoalsByDay,
} from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, gt, gte, lt } from "drizzle-orm";
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
      // Check if the user has already logged this dish today
      const eatenAt = input.eatenAt ?? new Date();

      const startOfDay = new Date(eatenAt);
      startOfDay.setHours(0, 0, 0, 0);

      const startOfNextDay = new Date(startOfDay);
      startOfNextDay.setDate(startOfNextDay.getDate() + 1);

      const existing = await ctx.db
        .select({
          id: loggedMeals.id,
          servings: loggedMeals.servings,
        })
        .from(loggedMeals)
        .where(
          and(
            eq(loggedMeals.userId, input.userId),
            eq(loggedMeals.dishId, input.dishId),
            gte(loggedMeals.eatenAt, startOfDay),
            lt(loggedMeals.eatenAt, startOfNextDay),
          ),
        )
        .limit(1);

      // If already logged today, update servings instead of creating a new entry
      if (existing[0]) {
        const updated = await ctx.db
          .update(loggedMeals)
          .set({
            servings: existing[0].servings + input.servings,
          })
          .where(eq(loggedMeals.id, existing[0].id))
          .returning();

        if (!updated[0]) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update logged meal",
          });
        }

        return updated[0];
      }

      // Log entry as usual
      const result = await ctx.db
        .insert(loggedMeals)
        .values({
          userId: input.userId,
          dishId: input.dishId,
          dishName: input.dishName,
          servings: input.servings,
          eatenAt,
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
            eq(loggedMeals.userId, input.userId),
          ),
        )
        .orderBy(desc(loggedMeals.eatenAt));

      return meals;
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
          message: "Logged meal not found",
        });
      }

      return result[0];
    }),

  getGoals: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.userGoals.findFirst({
        where: (userGoals, { eq }) => eq(userGoals.userId, input.userId),
      });
      return result ?? null;
    }),

  upsertGoals: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        calorieGoal: z.number().min(100).max(10000),
        proteinGoal: z.number().min(1).max(500),
        carbGoal: z.number().min(1).max(1000),
        fatGoal: z.number().min(1).max(500),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(userGoals)
        .values(input)
        .onConflictDoUpdate({
          target: userGoals.userId,
          set: {
            calorieGoal: input.calorieGoal,
            proteinGoal: input.proteinGoal,
            carbGoal: input.carbGoal,
            fatGoal: input.fatGoal,
          },
        })
        .returning();

      return result[0];
    }),

  getGoalsByDay: publicProcedure
    .input(z.object({ userId: z.string(), date: z.string() }))
    .query(async ({ ctx, input }) => {
      const dayGoal = await ctx.db
        .select()
        .from(userGoalsByDay)
        .where(
          and(
            eq(userGoalsByDay.userId, input.userId),
            eq(userGoalsByDay.date, input.date),
          ),
        )
        .limit(1);

      if (dayGoal[0]) return dayGoal[0];

      const defaultGoal = await ctx.db
        .select()
        .from(userGoals)
        .where(eq(userGoals.userId, input.userId))
        .limit(1);

      return defaultGoal[0] ?? null;
    }),

  upsertGoalsByDay: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        date: z.string(),
        calorieGoal: z.number().min(100).max(10000),
        proteinGoal: z.number().min(1).max(500),
        carbGoal: z.number().min(1).max(1000),
        fatGoal: z.number().min(1).max(500),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(userGoalsByDay)
        .values(input)
        .onConflictDoUpdate({
          target: [userGoalsByDay.userId, userGoalsByDay.date],
          set: {
            calorieGoal: input.calorieGoal,
            proteinGoal: input.proteinGoal,
            carbGoal: input.carbGoal,
            fatGoal: input.fatGoal,
          },
        })
        .returning();

      return result[0];
    }),
});
