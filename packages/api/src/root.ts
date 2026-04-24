import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { allergiesRouter } from "./allergies/router";
import { getContributors } from "./contributors/services";
import { dishRouter } from "./dishes/router";
import { eventRouter } from "./events/router";
import { favoriteRouter } from "./favorites/router";
import { notificationRouter } from "./notifications/router";
import { nutritionRouter } from "./nutrition/router";
import { preferencesRouter } from "./preferences/router";
import {
  getAvailableDateRange,
  getRestaurantByDate,
} from "./restaurants/services";
import { createTRPCRouter, publicProcedure } from "./trpc";
import { userRouter } from "./users/router";

export const appRouter = createTRPCRouter({
  event: eventRouter,
  dish: dishRouter,
  favorite: favoriteRouter,
  notification: notificationRouter,
  user: userRouter,
  preference: preferencesRouter,
  allergy: allergiesRouter,
  nutrition: nutritionRouter,
  /** Get information for a given restaurant. */
  restaurant: publicProcedure
    .input(
      z.object({
        date: z.date(),
        restaurant: z.enum(["anteatery", "brandywine"]),
      }),
    )
    .query(async ({ input, ctx: { db } }) =>
      getRestaurantByDate("anteatery", db, input.date),
    ),
  /** Get earliest and latest days we currently have meal info for. */
  pickableDates: publicProcedure.query(
    async () => await getAvailableDateRange(),
  ),
  /** Get all current contributors to PeterPlate's GitHub repo. */
  peterplate_contributors: publicProcedure.query(
    async ({ ctx: { db } }) =>
      await getContributors(db).catch((error) => {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching contributors.",
        });
      }),
  ),
});

// export type definition of API
export type AppRouter = typeof appRouter;
