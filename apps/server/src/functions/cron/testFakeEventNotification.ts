import webpush from "web-push";
import { eq } from "drizzle-orm";

import {
  createDrizzle,
  getRestaurantNameById,
  pool,
  pushSubscriptions,
  savedNotifications,
} from "@peterplate/db";

import { logger } from "../../../logger";
import { env } from "../env";

webpush.setVapidDetails(
  "mailto:admin@peterplate.com",
  env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY,
);

// Hardcoded fake event mirroring the AnteaterAPI dining-events shape so this
// script can be run on demand to verify the event-notification flow without
// needing a real upcoming event in the AAPI feed.
const FAKE_EVENT = {
  title: "[TEST] Lobster Night",
  restaurantId: "anteatery" as const,
  description: "Fake test event — surf & turf served all evening.",
  start: new Date(),
  end: new Date(Date.now() + 2 * 60 * 60 * 1000),
};

export const main = async (_event, _context) => {
  const connectionString = env.DATABASE_URL;

  try {
    logger.info("Starting FAKE event push notification job...");
    const db = createDrizzle({ connectionString });

    const subscriptions = await db
      .select({
        userId: pushSubscriptions.userId,
        endpoint: pushSubscriptions.endpoint,
        p256dh: pushSubscriptions.p256dh,
        auth: pushSubscriptions.auth,
      })
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.isSubscribedEvents, true));

    if (subscriptions.length === 0) {
      logger.info("No users subscribed to event notifications.");
      return;
    }

    logger.info(
      `Sending fake event notification to ${subscriptions.length} device(s)...`,
    );

    const restaurantName = getRestaurantNameById(FAKE_EVENT.restaurantId);
    const body = FAKE_EVENT.description || FAKE_EVENT.title;
    const message = `Special event at ${restaurantName}: ${body}`;
    const payload = JSON.stringify({
      title: `Special event at ${restaurantName} 🎉`,
      body,
      icon: "/icons/icon-192x192.png",
      data: { url: "/events" },
    });

    const results = await Promise.allSettled(
      subscriptions.map(async ({ userId, endpoint, p256dh, auth }) => {
        await db.insert(savedNotifications).values({
          userId,
          message,
          type: "event",
        });

        try {
          await webpush.sendNotification(
            { endpoint, keys: { p256dh, auth } },
            payload,
          );
        } catch (error: any) {
          if (error.statusCode === 410 || error.statusCode === 404) {
            logger.info({ endpoint }, "Subscription expired, removing from DB...");
            await db
              .delete(pushSubscriptions)
              .where(eq(pushSubscriptions.endpoint, endpoint));
          } else {
            throw error;
          }
        }
      }),
    );

    results
      .filter((r) => r.status === "rejected")
      .forEach((r) =>
        logger.error((r as PromiseRejectedResult).reason, "Failed to send notification"),
      );
  } catch (error) {
    logger.error(error, "Failed to execute fake event push notification job");
  } finally {
    logger.info("Closing connection pool...");
    await pool({ connectionString }).end();
    logger.info("Closed connection pool.");
    logger.info("Finished fake event push notification job.");
  }
};
