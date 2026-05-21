import { createTRPCRouter, publicProcedure } from "@api/trpc";
import {
  PushSubscriptionSchema,
  PushTokenSchema,
  pushTokens,
} from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { Expo } from "expo-server-sdk";
import { z } from "zod";
import {
  getSavedNotifications,
  getSubscription,
  markAllNotificationsRead,
  subscribeUser,
  unsubscribeUser,
  updateSubscription,
} from "./services";

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

  // Update food/event subscription toggles.
  updateSubscription: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        isSubscribedFoodFavorites: z.boolean().optional(),
        isSubscribedEvents: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const { userId, ...data } = input;
      await updateSubscription(db, userId, data);
    }),

  // Get saved notifications for a user.
  getSavedNotifications: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      return await getSavedNotifications(db, input.userId);
    }),

  // Mark all of a user's notifications as read.
  markAllRead: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      await markAllNotificationsRead(db, input.userId);
    }),
});
