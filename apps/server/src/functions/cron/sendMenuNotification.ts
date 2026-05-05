import webpush from "web-push";
import { eq } from "drizzle-orm";
import { formatInTimeZone } from "date-fns-tz";

import {
  createDrizzle,
  dishes,
  dishesToMenus,
  favorites,
  menus,
  pool,
  pushSubscriptions,
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
    logger.info("Starting menu push notification job...");
    const db = createDrizzle({ connectionString });

    const today = formatInTimeZone(new Date(), TIMEZONE, "yyyy-MM-dd");

    const matches = await db
      .select({
        endpoint: pushSubscriptions.endpoint,
        p256dh: pushSubscriptions.p256dh,
        auth: pushSubscriptions.auth,
        dishName: dishes.name,
      })
      .from(pushSubscriptions)
      .innerJoin(favorites, eq(pushSubscriptions.userId, favorites.userId))
      .innerJoin(dishesToMenus, eq(favorites.dishId, dishesToMenus.dishId))
      .innerJoin(menus, eq(dishesToMenus.menuId, menus.id))
      .innerJoin(dishes, eq(favorites.dishId, dishes.id))
      .where(eq(menus.date, today));

    if (matches.length === 0) {
      logger.info("No users have favorited dishes serving today.");
      return;
    }

    // Group by endpoint so each device gets one notification listing all matching favorites
    const notificationMap = new Map<
      string,
      { keys: { p256dh: string; auth: string }; dishNames: string[] }
    >();

    for (const match of matches) {
      if (!notificationMap.has(match.endpoint)) {
        notificationMap.set(match.endpoint, {
          keys: { p256dh: match.p256dh, auth: match.auth },
          dishNames: [],
        });
      }
      notificationMap.get(match.endpoint)!.dishNames.push(match.dishName);
    }

    logger.info(`Sending notifications to ${notificationMap.size} device(s)...`);

    const results = await Promise.allSettled(
      Array.from(notificationMap.entries()).map(async ([endpoint, { keys, dishNames }]) => {
        const uniqueDishes = [...new Set(dishNames)];
        const body =
          uniqueDishes.length === 1
            ? `${uniqueDishes[0]} is serving today!`
            : `Your favorites are serving today: ${uniqueDishes.join(", ")}`;

        const payload = JSON.stringify({
          title: "Favorite Dish Alert!",
          body,
          icon: "/icons/icon-192x192.png",
          data: { url: "/my-favorites" },
        });

        try {
          await webpush.sendNotification({ endpoint, keys }, payload);
        } catch (error: any) {
          // 410 Gone / 404 means the user revoked the subscription in their browser
          if (error.statusCode === 410 || error.statusCode === 404) {
            logger.info({ endpoint }, "Subscription expired, removing from DB...");
            await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
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
    logger.error(error, "Failed to execute menu push notification job");
  } finally {
    logger.info("Closing connection pool...");
    await pool({ connectionString }).end();
    logger.info("Closed connection pool.");
    logger.info("Finished menu push notification job.");
  }
};
