import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { addAllergies, deleteAllergy, getAllergies } from "./services";

const getAllergiesProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx: { db }, input }) => {
    return await getAllergies(db, input.userId).catch((e) => {
      if (e instanceof TRPCError) throw e;
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error getting allergies",
      });
    });
  });

const addAllergiesProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      allergies: z.array(z.string()),
    }),
  )
  .mutation(async ({ ctx: { db }, input }) => {
    return await addAllergies(db, input.userId, input.allergies).catch((e) => {
      if (e instanceof TRPCError) throw e;
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error adding allergies",
      });
    });
  });

const deleteAllergyProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      allergy: z.string(),
    }),
  )
  .mutation(async ({ ctx: { db }, input }) => {
    return await deleteAllergy(db, input.userId, input.allergy).catch((e) => {
      if (e instanceof TRPCError) throw e;
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error deleting allergy",
      });
    });
  });

export const allergiesRouter = createTRPCRouter({
  /** Get all allergies for a given user ID. Returns empty array if no allergies */
  getAllergies: getAllergiesProcedure,
  /** Add list of allergies for a given user. No change if allergies are already present */
  addAllergies: addAllergiesProcedure,
  /** Delete allergy for a given user. If doesn't exist, no change occurs */
  deleteAllergy: deleteAllergyProcedure,
});
