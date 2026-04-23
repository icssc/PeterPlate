import { getDishes } from "@api/dishes/services";
import type { Drizzle, RestaurantId } from "@peterplate/db";
import {
  type DishWithRating,
  getDateRangeOfAvailableDiningDataResponseSchema,
  getRestaurantsResponseSchema,
  getStateForRestaurantOnDayResponseSchema,
} from "@peterplate/validators";
import { TRPCError } from "@trpc/server";
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

export type FormattedRestaurantInfo = {
  name: string;
  periods: {
    name: string;
    startTime: string;
    endTime: string;
    stations: {
      name: string;
      dishes: DishWithRating[];
    }[];
  }[];
};

export async function getRestaurantByDate(
  restaurant: RestaurantId,
  db: Drizzle,
  date: Date,
): Promise<FormattedRestaurantInfo> {
  const restarauntReq = await fetch(
    `${AAPI_DINING_ROUTE}/restaurants?id=${restaurant}`,
  );

  const dateString = date.toLocaleDateString("en-CA");
  const dishReq = await fetch(
    `${AAPI_DINING_ROUTE}/restaurantToday?id=${restaurant}&date=${dateString}`,
  );

  console.log(
    `${AAPI_DINING_ROUTE}/restaurantToday?id=${restaurant}&date=${dateString}`,
  );
  if (!(restarauntReq.ok && dishReq.ok))
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Could not reach restaurants endpoint: ${!restarauntReq.ok ? restarauntReq.statusText : " "}${dishReq.statusText}`,
    });

  const restaurantParsed = getRestaurantsResponseSchema.safeParse(
    await restarauntReq.json(),
  );
  const dishParsed = getStateForRestaurantOnDayResponseSchema.safeParse(
    await dishReq.json(),
  );

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

  const periods = await Promise.all(
    validPeriods.map(
      async (period) =>
        ({
          name: period.name,
          startTime: period.startTime ?? "",
          endTime: period.endTime ?? "",
          stations: await Promise.all(
            Object.entries(period.stationToDishes).map(
              async ([stationId, dishIds]) =>
                ({
                  name:
                    stationIdToName.get(Number.parseInt(stationId, 10)) ??
                    "UNKNOWN",
                  dishes: await getDishes(dishIds, db),
                }) satisfies FormattedRestaurantInfo["periods"][0]["stations"][0],
            ),
          ),
        }) satisfies FormattedRestaurantInfo["periods"][0],
    ),
  );

  return {
    name: restaurant,
    periods,
  } satisfies FormattedRestaurantInfo;
}
