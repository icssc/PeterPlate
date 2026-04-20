import type {
  DiningEventPayload,
  DiningMenuPayload,
  DiningRestaurantPayload,
  DiningStationPayload,
  PeterPlateDiningPayload,
} from "@api/dining/types";
import { getDishesById } from "@api/dishes/services";
import { upsert } from "@api/utils";
import type { Drizzle, InsertRestaurant } from "@peterplate/db";
import { restaurants } from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { formatInTimeZone } from "date-fns-tz";
import { z } from "zod";
import { AAPI_DINING_ROUTE } from "..";

const diningHallIdSchema = z.enum(["anteatery", "brandywine"]);

const restaurantsResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  data: z.array(
    z.object({
      id: diningHallIdSchema,
      updatedAt: z.string(),
      stations: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          updatedAt: z.string(),
        }),
      ),
    }),
  ),
});

const restaurantTodayResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  data: z.object({
    id: diningHallIdSchema,
    updatedAt: z.string(),
    periods: z.record(
      z.string(),
      z.object({
        name: z.string(),
        startTime: z.string().nullable(),
        endTime: z.string().nullable(),
        stationToDishes: z.record(z.string(), z.array(z.string())),
        updatedAt: z.string(),
      }),
    ),
  }),
});

const eventsResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  data: z.array(
    z.object({
      title: z.string(),
      image: z.string().nullable(),
      restaurantId: diningHallIdSchema,
      description: z.string().nullable(),
      start: z.coerce.date(),
      end: z.coerce.date().nullable(),
      updatedAt: z.coerce.date(),
    }),
  ),
});

export const upsertRestaurant = async (
  db: Drizzle,
  restaurant: InsertRestaurant,
) =>
  await upsert(db, restaurants, restaurant, {
    target: restaurants.id,
    set: restaurant,
  });

export type RestaurantInfo = DiningRestaurantPayload;

export async function getRestaurantsByDate(
  db: Drizzle,
  date: Date,
): Promise<PeterPlateDiningPayload> {
  const dateString = formatInTimeZone(
    date,
    "America/Los_Angeles",
    "yyyy-MM-dd",
  );
  const [anteateryTodayResult, brandywineTodayResult] = await Promise.all([
    fetchRestaurantToday("anteatery", dateString),
    fetchRestaurantToday("brandywine", dateString),
  ]);

  const [restaurantsResponse, eventsResponse] = await Promise.all([
    fetch(`${AAPI_DINING_ROUTE}/restaurants`),
    fetch(`${AAPI_DINING_ROUTE}/events`),
  ]);

  if (!restaurantsResponse.ok || !eventsResponse.ok) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Could not reach AnteaterAPI dining endpoints.",
    });
  }

  const [restaurantsResult, eventsResult] = await Promise.all([
    restaurantsResponse.json(),
    eventsResponse.json(),
  ]);

  const parsedRestaurants =
    restaurantsResponseSchema.safeParse(restaurantsResult);
  const parsedEvents = eventsResponseSchema.safeParse(eventsResult);

  if (!parsedRestaurants.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: `Could not parse AnteaterAPI restaurants response: ${parsedRestaurants.error.message}`,
    });
  }

  if (!parsedEvents.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: `Could not parse AnteaterAPI events response: ${parsedEvents.error.message}`,
    });
  }

  const restaurantsById = new Map(
    parsedRestaurants.data.data.map((restaurant) => [
      restaurant.id,
      restaurant,
    ]),
  );

  return {
    anteatery: await buildRestaurantPayload({
      db,
      dateString,
      restaurant: restaurantsById.get("anteatery"),
      restaurantToday: anteateryTodayResult,
      events: parsedEvents.data.data.filter(
        (event) => event.restaurantId === "anteatery",
      ),
    }),
    brandywine: await buildRestaurantPayload({
      db,
      dateString,
      restaurant: restaurantsById.get("brandywine"),
      restaurantToday: brandywineTodayResult,
      events: parsedEvents.data.data.filter(
        (event) => event.restaurantId === "brandywine",
      ),
    }),
  };
}

async function buildRestaurantPayload({
  db,
  dateString,
  restaurant,
  restaurantToday,
  events,
}: {
  db: Drizzle;
  dateString: string;
  restaurant:
    | z.infer<typeof restaurantsResponseSchema>["data"][number]
    | undefined;
  restaurantToday: z.infer<typeof restaurantTodayResponseSchema>["data"] | null;
  events: z.infer<typeof eventsResponseSchema>["data"];
}): Promise<RestaurantInfo> {
  if (!restaurant) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Restaurant metadata not found in AnteaterAPI response.",
    });
  }

  const eventsPayload: DiningEventPayload[] = events.map((event) => ({
    title: event.title,
    image: event.image,
    restaurantId: event.restaurantId,
    shortDescription: event.description,
    longDescription: event.description,
    start: event.start,
    end: event.end,
  }));

  if (!restaurantToday) {
    return {
      id: restaurant.id,
      name: restaurant.id,
      events: eventsPayload,
      menus: [],
    };
  }

  const stationNames = new Map(
    restaurant.stations.map((station) => [station.id, station.name]),
  );
  const allDishIds = [
    ...new Set(
      Object.values(restaurantToday.periods)
        .flatMap((period) => Object.values(period.stationToDishes))
        .flat(),
    ),
  ];
  const dishes = await getDishesById(db, allDishIds);
  const dishesById = new Map(dishes.map((dish) => [dish.id, dish]));

  const menus = Object.entries(restaurantToday.periods)
    .map(([periodId, period]): DiningMenuPayload | null => {
      if (!period.startTime || !period.endTime) {
        return null;
      }

      const stations = Object.entries(period.stationToDishes)
        .map(([stationId, dishIds]): DiningStationPayload | null => {
          const stationDishes = dishIds
            .map((dishId) => dishesById.get(dishId))
            .filter((dish) => dish !== undefined)
            .map((dish) => ({
              ...dish,
              menuId: periodId,
              restaurant: restaurant.id,
              image_url: dish.imageUrl ?? null,
            }));

          if (stationDishes.length === 0) {
            return null;
          }

          return {
            id: stationId,
            name: stationNames.get(stationId) ?? stationId,
            dishes: stationDishes,
          };
        })
        .filter(isNonNull);

      if (stations.length === 0) {
        return null;
      }

      return {
        id: periodId,
        date: dateString,
        period: {
          name: period.name,
          startTime: period.startTime,
          endTime: period.endTime,
        },
        stations,
        price: null,
      };
    })
    .filter(isNonNull)
    .sort((firstMenu, secondMenu) =>
      firstMenu.period.startTime.localeCompare(secondMenu.period.startTime),
    );

  return {
    id: restaurant.id,
    name: restaurant.id,
    events: eventsPayload,
    menus,
  };
}

function isNonNull<T>(value: T | null): value is T {
  return value !== null;
}

async function fetchRestaurantToday(
  restaurantId: z.infer<typeof diningHallIdSchema>,
  dateString: string,
): Promise<z.infer<typeof restaurantTodayResponseSchema>["data"] | null> {
  const response = await fetch(
    `${AAPI_DINING_ROUTE}/restaurantToday?id=${restaurantId}&date=${dateString}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: `Could not reach AnteaterAPI restaurantToday endpoint for ${restaurantId}.`,
    });
  }

  const parsedResult = restaurantTodayResponseSchema.safeParse(
    await response.json(),
  );

  if (!parsedResult.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: `Could not parse AnteaterAPI restaurantToday response for ${restaurantId}: ${parsedResult.error.message}`,
    });
  }

  return parsedResult.data.data;
}
