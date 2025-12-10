import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getContributors } from "./contributors/services";
import { dishRouter } from "./dishes/router";
import { eventRouter } from "./events/router";
import { favoriteRouter } from "./favorites/router";
import { notificationRouter } from "./notifications/router";
import { getRestaurantsByDate } from "./restaurants/services";
import { createTRPCRouter, publicProcedure } from "./trpc";
import { userRouter } from "./users/router";
import { nutritionRouter } from "./nutrition/router";
import { getContributors } from "./contributors/services";
import { getPickableDates } from "./menus/services";

export const appRouter = createTRPCRouter({
  event: eventRouter,
  dish: dishRouter,
  favorite: favoriteRouter,
  notification: notificationRouter,
  user: userRouter,
  nutrition: nutritionRouter,
  /** Returns "Hello, world!" */
  hello: publicProcedure.query(() => "Hello, world!"),
  /** Get all information about restaurants on a given date. */
  peterplate: publicProcedure.input(z.object({ date: z.date() })).query(
    async ({ ctx: { db }, input: { date } }) =>
      await getRestaurantsByDate(db, date).catch((error) => {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching restaurants",
        });
      }),
  ),
  /** Get earliest and latest days we currently have meal info for. */
  pickableDates: publicProcedure.query(
    async ({ctx: { db }}) => 
      await getPickableDates(db).catch((error) => {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching dates with meal information."
        });
      }),
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
