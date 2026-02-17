import { getUserRating } from "@api/ratings/services";
import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { UserSchema, users } from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getUser, upsertUser } from "./services";

const getUserProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(
    async ({ ctx: { db }, input }) =>
      await getUser(db, input.id).catch((e) => {
        if (e instanceof TRPCError) throw e;
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "error getting user",
        });
      }),
  );

const upsertUserProcedure = publicProcedure.input(UserSchema).mutation(
  async ({ ctx: { db }, input }) =>
    await upsertUser(db, input).catch((e) => {
      if (e instanceof TRPCError) throw e;
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error upserting user",
      });
    }),
);

const getUserRatingProcedure = publicProcedure
  .input(z.object({ userId: z.string(), dishId: z.string() }))
  .query(async ({ ctx: { db }, input }) => {
    return await getUserRating(db, input.userId, input.dishId);
  });

const onboardProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx: { db }, input }) => {
    try {
      const result = await db
        .update(users)
        .set({
          hasOnboarded: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.id))
        .returning();

      if (result.length === 0)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "error onboarding user",
        });
    } catch (error) {
      console.error("Error onboading user:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error getting user",
      });
    }
  });

export const userRouter = createTRPCRouter({
  get: getUserProcedure,
  upsert: upsertUserProcedure,
  onboard: onboardProcedure,
  getUserRating: getUserRatingProcedure,
});
