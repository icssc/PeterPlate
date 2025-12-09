import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { addFavorite, deleteFavorite, getFavorites } from "./services";

const getFavoritesProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx: { db }, input }) => {
    return await getFavorites(db, input.userId).catch((e) => {
      if (e instanceof TRPCError) throw e;
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error getting favorites",
      });
    });
  });

const addFavoriteProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      dishId: z.string(),
    }),
  )
  .mutation(async ({ ctx: { db }, input }) => {
    return await addFavorite(db, input.userId, input.dishId).catch((e) => {
      if (e instanceof TRPCError)
        throw e;
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error adding favorite",
      });
    });
  });

const deleteFavoriteProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      dishId: z.string(),
    }),
  )
  .mutation(async ({ ctx: { db }, input }) => {
    return await deleteFavorite(db, input.userId, input.dishId).catch((e) => {
      if (e instanceof TRPCError)
        throw e;
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error deleting favorite",
      });
    });
  });

export const favoriteRouter = createTRPCRouter({
  /** Get all favorites for a given user ID. Returns empty array if no favorites. */
  getFavorites: getFavoritesProcedure,
  /** Add a favorite for a dish ID and user ID. Idempotent - no change if already exists. */
  addFavorite: addFavoriteProcedure,
  /** Delete a favorite for a dish ID and user ID. Idempotent - no change if doesn't exist. */
  deleteFavorite: deleteFavoriteProcedure,
});

