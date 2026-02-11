import { Expo } from "expo-server-sdk";
import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { TRPCError } from "@trpc/server";

import { pushTokens, PushTokenSchema } from "@peterplate/db";

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
  /** Register a push token and save it to the database. */
  register: registerPushToken,
});
