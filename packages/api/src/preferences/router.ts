import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  addDietaryPreferences,
  deletePreference,
  getDietaryPreferences,
} from "./services";

const getDietaryPreferencesProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx: { db }, input }) => {
    return await getDietaryPreferences(db, input.userId).catch((e) => {
      if (e instanceof TRPCError) throw e;
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error getting preferences",
      });
    });
  });

const addDietaryPreferencesProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      preferences: z.array(z.string()),
    }),
  )
  .mutation(async ({ ctx: { db }, input }) => {
    return await addDietaryPreferences(
      db,
      input.userId,
      input.preferences,
    ).catch((e) => {
      if (e instanceof TRPCError) throw e;
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error adding preferences",
      });
    });
  });

const deletePreferenceProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      preference: z.string(),
    }),
  )
  .mutation(async ({ ctx: { db }, input }) => {
    return await deletePreference(db, input.userId, input.preference).catch(
      (e) => {
        if (e instanceof TRPCError) throw e;
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "error deleting preference",
        });
      },
    );
  });

export const preferencesRouter = createTRPCRouter({
  /** Get all preferences for a given user ID. Returns empty array if no preferences */
  getDietaryPreferences: getDietaryPreferencesProcedure,
  /** Add list of preferences for a given user. No change if preferences are already present */
  addDietaryPreferences: addDietaryPreferencesProcedure,
  /** Delete preference for a given user. If doesn't exist, no change occurs */
  deletePreference: deletePreferenceProcedure,
});
