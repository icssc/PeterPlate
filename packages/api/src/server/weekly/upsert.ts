import { getRestaurantId, type Drizzle, type RestaurantName, type InsertMenu } from "@zotmeal/db";
import { DiningHallInformation } from "@zotmeal/validators";
import { upsertRestaurant } from "@api/restaurants/services";
import { upsertAllStations } from "@api/stations/services";
import { logger } from "@api/logger";
import { format } from "date-fns";
import { restaurantUrlMap, getLocationInformation, getAdobeEcommerceMenuWeekly, InsertDishWithModifiedRelations } from "../daily/parse";
import { getCurrentSchedule, upsertPeriods } from "../periods/services";
import { upsertMenuBatch } from "@api/menus/services";
import { parseAndUpsertDish } from "../dishes/services";

/**
 * Upserts the menu for the week starting at `date` for a restaurant, up until 
 * the next Sunday.
 * @param db the Drizzle database instance
 * @param date the date for which to upsert the menu
 * @param restaurantName the restaurant to upsert the menu for ("brandywine", "anteatery")
*/
export async function upsertMenusForWeek(
  db: Drizzle,
  date: Date,
  restaurantName: RestaurantName,
): Promise<void> {
  const restaurantId = getRestaurantId(restaurantName);
  const dayOfWeek = date.getDay();

  // Get all the periods and stations available for the week.
  const restaurantInfo: DiningHallInformation = await getLocationInformation(
    restaurantUrlMap[restaurantName],
    "ASC",
  );

  await upsertRestaurant(db, {
    id: restaurantId,
    name: restaurantName
  });

  await upsertAllStations(db, restaurantId, restaurantInfo);

  let upsertedDates: Date[] = [date];
  let daysUntilNextSunday = (7 - dayOfWeek) % 7 || 7;
  for (let i = 0; i <= daysUntilNextSunday; ++i) {
    let nextDate = new Date(date);
    nextDate.setDate(date.getDate() + i);
    upsertedDates.push(nextDate)    
  }

  // Keep a set of all relevant meal periods (ones that were relevant throughout
  // at least some days in the week) to query weekly on later
  let periodSet: Set<number> = new Set<number>();

  let dayPeriodMap = new Map<string, Set<number>>();

  await Promise.all(
    upsertedDates.map(async currentDate => {
      const currentDayOfWeek = currentDate.getDay();
      const currentSchedule = getCurrentSchedule(restaurantInfo.schedules, currentDate);
      const dateString = format(currentDate, "yyyy-MM-dd");

      // Get relevant meal periods for the day to upsert into periods table
      const relevantMealPeriods = currentSchedule.mealPeriods
        .filter(mealPeriod => mealPeriod.openHours[currentDayOfWeek] 
          && mealPeriod.closeHours[currentDayOfWeek]);
      
      let dayPeriodSet = new Set<number>();
      relevantMealPeriods.forEach(period => {
        periodSet.add(period.id);
        dayPeriodSet.add(period.id);
      });

      dayPeriodMap.set(dateString, dayPeriodSet);
      
      logger.info(`[weekly] Upserting ${relevantMealPeriods.length} periods...`);
      await upsertPeriods(db, restaurantId, dateString, currentDayOfWeek, relevantMealPeriods);
    })
  );

  const menusToUpsert: InsertMenu[] = [];
  const dishesToUpsert: {dish: InsertDishWithModifiedRelations, menuId: string}[] = [];

  await Promise.all(
    Array.from(periodSet).map(async (periodId) => {
      const currentPeriodWeekly = await getAdobeEcommerceMenuWeekly(
        date,
        restaurantName,
        periodId,
      );

      if (!currentPeriodWeekly) {
        logger.info(`[weekly] Skipping period ${periodId}, period is null.`);
        return;
      }

      Array.from(currentPeriodWeekly.entries()).map(([dateString, dishes]) => {
        // NOTE: For some head-scratching, infuriating reason, the API returns
        // dishes for a non-existent period that it doesn't have listed at a
        // certain day (i.e. No lunch on Saturdays, yet Lunch Meal period on
        // Saturdays returns some dishes), this is an issue because we now have to
        // make sure the period exists on the day for the returned data.
        // If the current date has this period, upsert, otherwise, skip.
        const periodsOfDay = dayPeriodMap.get(dateString);
        if (periodsOfDay && !periodsOfDay.has(periodId)) {
          return;
        }

        const menuIdHash = `${restaurantId}|${dateString}|${periodId}`;
        menusToUpsert.push({
          id: menuIdHash,
          periodId: periodId.toString(),
          date: dateString,
          price: "???", // NOTE: Not sure if this was ever provided in the API..
          restaurantId,
        });
        
        for (const dish of dishes) {
          if (dish.name !== "UNIDENTIFIED") {
            dishesToUpsert.push({ dish: { ...dish, menuId: menuIdHash }, menuId: menuIdHash });
          }
        }
      });
    }),
  );

  if (menusToUpsert.length > 0) {
    logger.info(`[weekly] Upserting ${menusToUpsert.length} menus...`);
    await upsertMenuBatch(db, menusToUpsert);
  }

  if (dishesToUpsert.length > 0) {
    logger.info(`[weekly] Upserting ${dishesToUpsert.length} dishes...`);
    await Promise.allSettled(
      dishesToUpsert.map(async d =>
        await parseAndUpsertDish(db, 
          restaurantInfo, 
          d.dish, 
          d.menuId
        )
      )
    );
  }
}