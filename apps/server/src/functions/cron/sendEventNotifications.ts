import webpush from "web-push";
import { eq } from "drizzle-orm";
import { formatInTimeZone } from "date-fns-tz";

import { createCaller, createTRPCContext } from "@peterplate/api";
import {
  createDrizzle,
  getRestaurantNameById,
  pool,
  pushSubscriptions,
  savedNotifications,
} from "@peterplate/db";

import { logger } from "../../../logger";
import { env } from "../env";

const TIMEZONE = "America/Los_Angeles";

webpush.setVapidDetails(
  "mailto:admin@peterplate.com",
  env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY,
);

export const main = async (_event, _context) => {
  const connectionString = env.DATABASE_URL;

  try {
    logger.info("Starting event push notification job...");
    const db = createDrizzle({ connectionString });

    const ctx = createTRPCContext({
      headers: new Headers({ "x-trpc-source": "cron" }),
      connectionString,
    });
    const trpc = createCaller(ctx);

    const upcomingEvents = await trpc.event.upcoming();

    const today = formatInTimeZone(new Date(), TIMEZONE, "yyyy-MM-dd");
    const eventsToday = upcomingEvents.filter(
      (event) =>
        event.start !== null &&
        formatInTimeZone(event.start, TIMEZONE, "yyyy-MM-dd") === today,
    );

    if (eventsToday.length === 0) {
      logger.info("No dining hall events serving today.");
      return;
    }

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
      `Sending ${eventsToday.length} event notification(s) to ${subscriptions.length} device(s)...`,
    );

    const results = await Promise.allSettled(
      eventsToday.flatMap((event) => {
        const restaurantName = getRestaurantNameById(event.restaurantId);
        const body = event.shortDescription ?? event.title;
        const message = `Special event at ${restaurantName}: ${body}`;
        const payload = JSON.stringify({
          title: `Special event at ${restaurantName} 🎉`,
          body,
          icon: "/icons/icon-192x192.png",
          data: { url: "/events" },
        });

        return subscriptions.map(async ({ userId, endpoint, p256dh, auth }) => {
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
            // 410 Gone / 404 means the user revoked the subscription in their browser
            if (error.statusCode === 410 || error.statusCode === 404) {
              logger.info({ endpoint }, "Subscription expired, removing from DB...");
              await db
                .delete(pushSubscriptions)
                .where(eq(pushSubscriptions.endpoint, endpoint));
            } else {
              throw error;
            }
          }
        });
      }),
    );

    results
      .filter((r) => r.status === "rejected")
      .forEach((r) =>
        logger.error((r as PromiseRejectedResult).reason, "Failed to send notification"),
      );
  } catch (error) {
    logger.error(error, "Failed to execute event push notification job");
  } finally {
    logger.info("Closing connection pool...");
    await pool({ connectionString }).end();
    logger.info("Closed connection pool.");
    logger.info("Finished event push notification job.");
  }
};
