import { logger } from "@api/logger";

import type { Drizzle, RestaurantName } from "@peterplate/db";
import { upsertMenusForDate } from "./upsert";


export async function daily(
  db: Drizzle,
  date: Date,
  restaurantName: RestaurantName,
): Promise<void> {
  logger.info(
    `[daily] Updating ${restaurantName} menu for (${date.toLocaleDateString()})...`,
  );

  await upsertMenusForDate(db, date, restaurantName).catch((e) => {
    logger.error(
      e,
      `[daily] Failed to update ${restaurantName} menu for (${date.toLocaleDateString()}):`,
    );
    throw e;
  });

  logger.info(
    `[daily] Updated ${restaurantName} menu for (${date.toLocaleDateString()}).`,
  );
}