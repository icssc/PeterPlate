import { upsert } from "@api/utils";
import type {
  Drizzle,
  InsertRestaurant,
  SelectDietRestriction,
  SelectDish,
  SelectEvent,
  SelectMenu,
  SelectNutritionInfo,
  SelectPeriod,
  SelectRestaurant,
  SelectStation,
} from "@peterplate/db";
import { restaurants } from "@peterplate/db";
import { TRPCError } from "@trpc/server";
import { formatInTimeZone } from "date-fns-tz";

export const upsertRestaurant = async (
  db: Drizzle,
  restaurant: InsertRestaurant,
) =>
  await upsert(db, restaurants, restaurant, {
    target: restaurants.id,
    set: restaurant,
  });

/** Restaurant information for a given date. */
export interface RestaurantInfo extends SelectRestaurant {
  /** Events that are happening today or later. */
  events: SelectEvent[];
  /** List of menus for each period. */
  menus: (SelectMenu & {
    period: SelectPeriod;
    stations: (SelectStation & {
      dishes: (SelectDish & {
        menuId: SelectMenu["id"]; // derived from menu context (dishes_to_menus), not dishes.menu_id
        restaurant: SelectRestaurant["name"];
        dietRestriction: SelectDietRestriction;
        nutritionInfo: SelectNutritionInfo;
      })[];
    })[];
  })[];
}

/** Data object to be given to the client. */
interface PeterPlateData {
  anteatery: RestaurantInfo;
  brandywine: RestaurantInfo;
}

/**
 * Get menus and events for each restaurant. Fetches menus that correspond to the
 * given date and events that are happening today or later.
 */
export async function getRestaurantsByDate(
  db: Drizzle,
  date: Date,
): Promise<PeterPlateData> {
  const restaurants = await db.query.restaurants.findMany({
    with: {
      /** Get menus that correspond to the given date. */
      menus: {
        where: (menus, { eq }) =>
          eq(
            menus.date,
            formatInTimeZone(date, "America/Los_Angeles", "yyyy-MM-dd"),
          ),
        with: {
          period: true,
          dishesToMenus: {
            with: {
              dish: {
                with: {
                  dietRestriction: true,
                  nutritionInfo: true,
                },
              },
            },
          },
        },
      },
      /** Get events that are happening today or later. */
      events: {
        where: (events, { gte }) => gte(events.end, new Date()),
      },
      stations: true,
    },
  });

  // Transform data to the expected format
  const [firstRestaurant, secondRestaurant] = restaurants.map(
    ({ menus, events, stations, ...restaurant }) => ({
      ...restaurant,
      menus: menus
        .map(({ period, dishesToMenus, ...menu }) => ({
          ...menu,
          /** Only include stations that have dishes */
          stations: stations
            .map((station) => ({
              ...station,
              dishes: dishesToMenus
                .map((dishToMenu) => ({
                  ...dishToMenu.dish,
                  image_url: dishToMenu.dish.image_url ?? null,
                  menuId: menu.id, // derived from menu we’re iterating, not from dish row
                  restaurant: restaurant.name,
                }))
                .filter((dish) => dish.stationId === station.id),
            }))
            .filter((station) => station.dishes.length),
          // ? include this if we want a flat list of dishes
          // dishes: dishesToMenus.map((dishToMenu) => dishToMenu.dish),
          period,
        }))
        .sort((a, b) => a.period.startTime.localeCompare(b.period.startTime)),
      events,
      stations,
    }),
  );

  if (!firstRestaurant || !secondRestaurant)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Restaurants not found, there should always be two restaurants",
    });

  return firstRestaurant.name === "anteatery"
    ? {
        anteatery: firstRestaurant,
        brandywine: secondRestaurant,
      }
    : {
        anteatery: secondRestaurant,
        brandywine: firstRestaurant,
      };
}
