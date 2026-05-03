import { createTRPCRouter, publicProcedure } from "@api/trpc";
import {
  PushSubscriptionSchema,
  PushTokenSchema,
  pushTokens,
} from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { Expo } from "expo-server-sdk";
import { z } from "zod";
import { getSubscription, subscribeUser, unsubscribeUser } from "./services";

const registerPushToken = publicProcedure
  .input(PushTokenSchema)
  .query(async ({ ctx: { db }, input }) => {
    if (!Expo.isExpoPushToken(input.token)) {
      console.error("pushToken", pushTokens);
      throw new TRPCError({
        message: "invalid push token",
        code: "BAD_REQUEST",
      });
    }
    await db.insert(pushTokens).values(input);
  });

export const notificationRouter = createTRPCRouter({
  // Register a push token and save it to the database.
  register: registerPushToken,

  // Subscribe user to PWA push notifications.
  subscribe: publicProcedure
    .input(PushSubscriptionSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      await subscribeUser(db, input);
    }),

  //Unsubscribe user from PWA push notifications.
  unsubscribe: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      await unsubscribeUser(db, input.userId);
    }),

  // Get a user's push subscription if it exists.
  getSubscription: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      return await getSubscription(db, input.userId);
    }),
});
