import { getDishes } from "@api/dishes/services";
import type { Drizzle, RestaurantId } from "@peterplate/db";
import type { DishWithRating } from "@peterplate/validators";
import {
  getDateRangeOfAvailableDiningDataResponseSchema,
  getRestaurantsResponseSchema,
  getStateForRestaurantOnDayResponseSchema,
} from "@peterplate/validators";
import { TRPCError } from "@trpc/server";
import type { FormattedRestaurantInfo } from "..";
import { AAPI_DINING_ROUTE } from "..";

export async function getAvailableDateRange() {
  const req = await fetch(`${AAPI_DINING_ROUTE}/dateRange`);

  if (!req.ok)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Could not reach dateRange endpoint.",
    });

  const parsedData = getDateRangeOfAvailableDiningDataResponseSchema.safeParse(
    await req.json(),
  );

  if (!parsedData.success)
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: `Could not parse dateRange response: ${parsedData.error}`,
    });

  return parsedData.data.data;
}

export async function getRestaurantByDate(
  restaurant: RestaurantId,
  db: Drizzle,
  date: Date,
): Promise<FormattedRestaurantInfo> {
  const dateString = date.toLocaleDateString("en-CA", {
    timeZone: "America/Los_Angeles",
  });

  // CHANGE 1: these two calls don't depend on each other, so run them at the same time.
  const [restarauntReq, dishReq] = await Promise.all([
    fetch(`${AAPI_DINING_ROUTE}/restaurants?id=${restaurant}`),
    fetch(
      `${AAPI_DINING_ROUTE}/restaurantToday?id=${restaurant}&date=${dateString}`,
    ),
  ]);

  if (!(restarauntReq.ok && dishReq.ok))
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Could not reach restaurants endpoint: ${!restarauntReq.ok ? restarauntReq.statusText : " "}${dishReq.statusText}`,
    });

  const [restaurantJson, dishJson] = await Promise.all([
    restarauntReq.json(),
    dishReq.json(),
  ]);
  const restaurantParsed =
    getRestaurantsResponseSchema.safeParse(restaurantJson);
  const dishParsed =
    getStateForRestaurantOnDayResponseSchema.safeParse(dishJson);

  if (!(restaurantParsed.success && dishParsed.success))
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: `Could not parse restaurants response: ${restaurantParsed.error ?? dishParsed.error}`,
    });

  const restaurantData = restaurantParsed.data.data;
  const dishData = dishParsed.data.data;

  const validPeriods = Object.values(dishData.periods).filter(
    (period) => period.startTime && period.endTime,
  );

  const stationIdToName = new Map(
    restaurantData.flatMap((restaurant) =>
      restaurant.stations.map((station) => [station.id, station.name]),
    ),
  );

  // CHANGE 2: one dish call for every period instead of one call per period.
  // Periods share many dishes (e.g. 65 IDs -> 48 unique for Brandywine).
  const allDishIds = [
    ...new Set(
      validPeriods.flatMap((period) =>
        Object.values(period.stationToDishes).flat(),
      ),
    ),
  ];
  const allDishes = allDishIds.length ? await getDishes(allDishIds, db) : [];
  const dishesLookup = new Map(allDishes.map((d) => [d.id, d]));

  const periods = validPeriods.map((period) => ({
    name: period.name,
    startTime: period.startTime ?? "",
    endTime: period.endTime ?? "",
    stations: Object.entries(period.stationToDishes).map(([sId, dIds]) => ({
      name: stationIdToName.get(Number.parseInt(sId, 10)) ?? "UNKNOWN",
      dishes: dIds
        .map((id) => dishesLookup.get(id))
        .filter(Boolean) as DishWithRating[],
    })),
  }));

  return {
    name: restaurant,
    periods,
  } satisfies FormattedRestaurantInfo;
}
