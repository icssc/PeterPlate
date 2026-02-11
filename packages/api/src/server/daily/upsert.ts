import { logger } from "@api/logger";
import { upsertMenu } from "@api/menus/services";
import { upsertRestaurant } from "@api/restaurants/services";
import { upsertAllStations } from "@api/stations/services";
import {
  type Drizzle,
  getRestaurantId,
  type RestaurantName,
} from "@peterplate/db";
import type {
  DiningHallInformation,
  MealPeriodWithHours,
  Schedule,
} from "@peterplate/validators";
import { format } from "date-fns";
import { parseAndUpsertDish } from "../dishes/services";
import { getCurrentSchedule, upsertPeriods } from "../periods/services";
import {
  getAdobeEcommerceMenuDaily,
  getLocationInformation,
  restaurantUrlMap,
} from "./parse";

/**
 * Upserts the menu for the date `date` for a restaurant.
 * @param db the Drizzle database instance
 * @param date the date for which to upsert the menu
 * @param restaurantName the restaurant to upsert the menu for ("brandywine", "anteatery")
 */
export async function upsertMenusForDate(
  db: Drizzle,
  date: Date,
  restaurantName: RestaurantName,
): Promise<void> {
  const restaurantId = getRestaurantId(restaurantName);
  const dateString = format(date, "yyyy-MM-dd");
  const dayOfWeek = date.getDay();

  // Get all the periods and stations available today.
  const restaurantInfo: DiningHallInformation = await getLocationInformation(
    restaurantUrlMap[restaurantName],
    "ASC",
  );

  await upsertRestaurant(db, {
    id: restaurantId,
    name: restaurantName,
  });

  await upsertAllStations(db, restaurantId, restaurantInfo);

  const currentSchedule: Schedule = getCurrentSchedule(
    restaurantInfo.schedules,
    date,
  );

  // Get relevant periods from schedule that aligns with `date`
  // and has hours that day
  const relevantPeriods: MealPeriodWithHours[] =
    currentSchedule.mealPeriods.filter(
      (mealPeriod) =>
        mealPeriod.openHours[dayOfWeek] && mealPeriod.closeHours[dayOfWeek],
    );

  logger.info(`[daily] Upserting ${relevantPeriods.length} periods...`);
  await upsertPeriods(db, restaurantId, dateString, dayOfWeek, relevantPeriods);

  const menuResult = await Promise.allSettled(
    relevantPeriods.map(async (period) => {
      const currentPeriodMenu = await getAdobeEcommerceMenuDaily(
        date,
        restaurantName,
        period.id,
      );

      const menuIdHash = `${restaurantId}|${dateString}|${period.id}`;

      await upsertMenu(db, {
        id: menuIdHash,
        periodId: period.id.toString(),
        date: dateString,
        price: null, // NOTE: Not sure if this was ever provided in the API..
        restaurantId,
      });

      logger.info(`[daily] Upserting ${currentPeriodMenu.length} dishes...`);
      await Promise.all(
        currentPeriodMenu.map(async (dish) => {
          if (dish.name === "UNIDENTIFIED") return;

          await parseAndUpsertDish(db, restaurantInfo, dish, menuIdHash);
        }),
      );
    }),
  );

  for (const menu of menuResult)
    if (menu.status === "rejected") {
      const reason = menu.reason;
      let menuDetail = "unknown menu";
      if (
        reason &&
        typeof reason === "object" &&
        "value" in reason &&
        reason.value &&
        typeof reason.value === "object" &&
        "name" in reason.value &&
        typeof reason.value.name === "string"
      ) {
        menuDetail = `menu '${reason.value.name}'`;
      } else if (reason instanceof Error) {
        menuDetail = `Error: ${reason.message}`;
      } else {
        menuDetail = `Reason: ${JSON.stringify(reason)}`;
      }
      logger.error(
        `Failed to insert menu ${menuDetail} for ${restaurantName}.`,
        reason,
      );
    }
}
