import webpush from "web-push";
import { eq } from "drizzle-orm";
import { formatInTimeZone } from "date-fns-tz";

import { createCaller, createTRPCContext } from "@peterplate/api";
import {
  createDrizzle,
  favorites,
  pool,
  pushSubscriptions,
  type RestaurantId,
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
    logger.info("Starting menu push notification job...");
    const db = createDrizzle({ connectionString });

    const ctx = createTRPCContext({
      headers: new Headers({ "x-trpc-source": "cron" }),
      connectionString,
    });
    const trpc = createCaller(ctx);

    // Build a Date at noon UTC on the current Pacific calendar day so that
    // AAPI's local-date formatting (toLocaleDateString) lands on the right day
    // regardless of the server's timezone.
    const todayStr = formatInTimeZone(new Date(), TIMEZONE, "yyyy-MM-dd");
    const [y, m, d] = todayStr.split("-").map(Number) as [number, number, number];
    const today = new Date(Date.UTC(y, m - 1, d, 12));

    const rows = await db
      .select({
        userId: pushSubscriptions.userId,
        endpoint: pushSubscriptions.endpoint,
        p256dh: pushSubscriptions.p256dh,
        auth: pushSubscriptions.auth,
        dishId: favorites.dishId,
        restaurant: favorites.restaurant,
      })
      .from(pushSubscriptions)
      .innerJoin(favorites, eq(pushSubscriptions.userId, favorites.userId))
      .where(eq(pushSubscriptions.isSubscribedFoodFavorites, true));

    if (rows.length === 0) {
      logger.info("No subscribed users have favorited dishes.");
      return;
    }

    // Fetch today's served dishes only for restaurants we need.
    const neededRestaurants = Array.from(
      new Set(rows.map((r) => r.restaurant)),
    ) as RestaurantId[];

    const servedByRestaurant = new Map<RestaurantId, Map<string, string>>();
    for (const restaurant of neededRestaurants) {
      try {
        const data = await trpc.restaurant({ date: today, restaurant });
        const dishMap = new Map<string, string>();
        for (const period of data.periods) {
          for (const station of period.stations) {
            for (const dish of station.dishes) {
              dishMap.set(dish.id, dish.name);
            }
          }
        }
        servedByRestaurant.set(restaurant, dishMap);
      } catch (err) {
        logger.error(
          err,
          `Failed to fetch today's menu for restaurant ${restaurant}`,
        );
      }
    }

    // Group matches by endpoint so each device gets one combined notification.
    const notificationMap = new Map<
      string,
      {
        userId: string;
        keys: { p256dh: string; auth: string };
        dishNames: string[];
      }
    >();

    for (const row of rows) {
      const servedDishes = servedByRestaurant.get(row.restaurant);
      const dishName = servedDishes?.get(row.dishId);
      if (!dishName) continue;

      if (!notificationMap.has(row.endpoint)) {
        notificationMap.set(row.endpoint, {
          userId: row.userId,
          keys: { p256dh: row.p256dh, auth: row.auth },
          dishNames: [],
        });
      }
      notificationMap.get(row.endpoint)!.dishNames.push(dishName);
    }

    if (notificationMap.size === 0) {
      logger.info("No subscribed users have favorited dishes serving today.");
      return;
    }

    logger.info(`Sending notifications to ${notificationMap.size} device(s)...`);

    const results = await Promise.allSettled(
      Array.from(notificationMap.entries()).map(
        async ([endpoint, { userId, keys, dishNames }]) => {
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

          await db.insert(savedNotifications).values({
            userId,
            message: body,
            type: "food",
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
        },
      ),
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
