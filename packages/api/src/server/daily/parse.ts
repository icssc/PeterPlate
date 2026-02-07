// parse.ts
//
// This file contains all of the functions related to querying and processing
// data received from the UCI Dining GraphQL endpoint.

import { writeFileSync } from "node:fs";
import { logger } from "@api/logger";
import {
  getRestaurantId,
  type InsertDish,
  type InsertDishWithRelations,
  type InsertEvent,
  type RestaurantName,
} from "@zotmeal/db";
import {
  AEMEventListSchema,
  type DiningHallInformation,
  type EventList,
  GetLocationRecipesDailySchema,
  GetLocationRecipesWeeklySchema,
  GetLocationSchema,
  type LocationInfo,
  type LocationRecipesDaily,
  type LocationRecipesWeekly,
  type MealPeriodWithHours,
  type Schedule,
  type WeekTimes,
} from "@zotmeal/validators";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import {
  AEMEventListQuery,
  type AEMEventListQueryRestaurant,
  type AEMEventListQueryVariables,
  type GetLocationQueryVariables,
  GetLocationRecipesDailyQuery,
  type GetLocationRecipesDailyVariables,
  GetLocationRecipesWeeklyQuery,
  type GetLocationRecipesWeeklyVariables,
  getLocationQuery,
  graphQLEndpoint,
  graphQLHeaders,
} from "./queries";

/**
 * Queries the Adobe ECommerce endpoint for restaurant information, dishes, etc.
 * with the appropriate headers and POST method.
 * @param query the graphQL query string
 * @param variables the variables for the GraphQL query
 * @returns an AxiosResponse from the query
 */
export async function queryAdobeECommerce(
  query: string,
  variables: object,
): Promise<AxiosResponse> {
  try {
    const response = await axios({
      method: "get",
      url: graphQLEndpoint,
      headers: graphQLHeaders,
      params: {
        query: query,
        variables: JSON.stringify(variables),
      },
    });

    type ResponseWithQuery = AxiosResponse["data"] & {
      query: string;
      params: string;
    };
    const loggedResponse: ResponseWithQuery = {
      ...response.data,
      query: query,
      params: variables,
    };

    if (process.env.IS_LOCAL) {
      const outPath = `query-${new Date().toISOString().replace(/:/g, "-")}-response.json`;
      writeFileSync(`./${outPath}`, JSON.stringify(loggedResponse), {
        flag: "w",
      });
      logger.info(
        `[query] Wrote AdobeEcommerce response to ${process.cwd()}/${outPath}.`,
      );
    }

    return response;
  } catch (err: unknown) {
    console.error("GraphQL ERROR in queryAdobeECommerce:");

    if (axios.isAxiosError(err)) {
      const aErr = err as AxiosError;
      console.error("Axios message:", aErr.message);
      if (aErr.code) console.error("Error code:", aErr.code);
      console.error("HTTP status:", aErr.response?.status);
      console.error("Response body:", aErr.response?.data);
      // If no response, show the request info
      if (!aErr.response)
        console.error("No response received. Request:", aErr.request);
    } else {
      console.error(err);
    }

    throw err;
  }
}

/**
 * Gets the information associated with a restaurant location, such as
 * hours of operation, allergen intolerance codes, etc.
 * @param location the restaurant to get info for ("brandywine" | "anteatery")
 * @param sortOrder the order in which to sort the info ("ASC" | "DESC")
 * @returns @see{@link DiningHallInformation}
 */
export async function getLocationInformation(
  location: GetLocationQueryVariables["locationUrlKey"],
  sortOrder: GetLocationQueryVariables["sortOrder"],
): Promise<DiningHallInformation> {
  const getLocationVariables = {
    locationUrlKey: location,
    sortOrder: sortOrder,
  } as GetLocationQueryVariables;

  const response = await queryAdobeECommerce(
    getLocationQuery,
    getLocationVariables,
  );

  const parsedData: LocationInfo = GetLocationSchema.parse(response.data);

  const getLocation = parsedData.data.getLocation;
  const commerceMealPeriods = parsedData.data.Commerce_mealPeriods;
  const commerceAttributesList = parsedData.data.Commerce_attributesList;
  const schedules = getLocation.aemAttributes.hoursOfOperation.schedule;

  // Get all of the schedules
  const parsedSchedules: Schedule[] = schedules.map((schedule) => {
    const scheduleMealPeriods: MealPeriodWithHours[] =
      schedule.meal_periods.map((mealPeriod) => {
        const mealPeriodInfo = commerceMealPeriods.find(
          (cmp) => cmp.name === mealPeriod.meal_period,
        );

        const [openHours, closeHours] = parseOpeningHours(
          mealPeriod.opening_hours,
        );

        return {
          name: mealPeriod.meal_period,
          id: mealPeriodInfo?.id ?? "UNIDENTIFIED",
          position: mealPeriodInfo?.position ?? 0,
          openHours,
          closeHours,
        } as MealPeriodWithHours;
      });

    return {
      name: schedule.name,
      type: schedule.type,
      startDate: schedule.start_date,
      endDate: schedule.end_date,
      mealPeriods: scheduleMealPeriods,
    } as Schedule;
  });

  const allergenIntoleranceCodes: DiningHallInformation["allergenIntoleranceCodes"] =
    {};
  commerceAttributesList.items
    .find((item) => item.code === "allergens_intolerances")
    ?.options.forEach((item) => {
      allergenIntoleranceCodes[item.label] = Number.parseInt(item.value, 10);
    });

  const menuPreferenceCodes: DiningHallInformation["menuPreferenceCodes"] = {};
  commerceAttributesList.items
    .find((item) => item.code === "menu_preferences")
    ?.options.forEach((item) => {
      menuPreferenceCodes[item.label] = Number.parseInt(item.value, 10);
    });

  const stationsInfo: { [id: string]: string } = {};
  getLocation.commerceAttributes.children.forEach((station) => {
    stationsInfo[station.id] = station.name;
  });

  return {
    allergenIntoleranceCodes,
    menuPreferenceCodes,
    stationsInfo,
    schedules: parsedSchedules,
  };
}

export type InsertDishWithModifiedRelations = InsertDish & {
  nutritionInfo: InsertDishWithRelations["nutritionInfo"];
  recipeAllergenCodes: Set<number>;
  recipePreferenceCodes: Set<number>;
};

/**
 * Fetches the Adobe ECommerce Menu specified for the date.
 * @param date the date for which to get the menu
 * @param restaurantName the restaurant for which to get the menu
 * @param periodId the id of the period to query for
 * @returns a list of dishes + their nutrition info
 */
export async function getAdobeEcommerceMenuDaily(
  date: Date,
  restaurantName: RestaurantName,
  periodId: number,
): Promise<InsertDishWithModifiedRelations[]> {
  const getLocationRecipesVariables = {
    date: toISODateString(date),
    locationUrlKey: restaurantUrlMap[restaurantName],
    mealPeriod: periodId,
    viewType: "DAILY",
  } as GetLocationRecipesDailyVariables;

  const res = await queryAdobeECommerce(
    GetLocationRecipesDailyQuery,
    getLocationRecipesVariables,
  );

  const parsedData: LocationRecipesDaily = GetLocationRecipesDailySchema.parse(
    res.data,
  );

  const products = parsedData.data.getLocationRecipes.products;
  const locationRecipesMap =
    parsedData.data.getLocationRecipes.locationRecipesMap;

  // Return empty array if no data is available for this meal period
  if (products == null || locationRecipesMap == null) return [];

  const parsedProducts = parseProducts(products.items);
  const stationSkuMap = locationRecipesMap.stationSkuMap;

  // Map all of the items from each station into a list of dishes
  return stationSkuMap.flatMap((station) =>
    station.skus.map((sku) => {
      const item = parsedProducts[sku];

      return {
        id: sku,
        name: item?.name ?? "UNIDENTIFIED",
        stationId: station.id.toString(),
        description: item?.description ?? "",
        category: item?.category ?? "",
        ingredients: item?.ingredients ?? "",
        nutritionInfo: item?.nutritionInfo ?? {},
        recipeAllergenCodes: item?.allergenIntolerances ?? new Set<number>(),
        recipePreferenceCodes: item?.recipePreferences ?? new Set<number>(),
      } as InsertDishWithModifiedRelations;
    }),
  );
}

type DateDishMap = Map<string, InsertDishWithModifiedRelations[]>;
// TODO: Reorg into separate file? Or just overhaul the
//       server function organization entirely?
/**
 * Fetches the Adobe ECommerce Menu specified for a week, starting at the date.
 * @param date the date for which to start getting the menus
 * @param restaurantName the restaurant for which to get the dishes
 * @param periodId the meal period to get the menus for
 * @returns returns a list of objects for each date (@see {@link DateDish})
 */
export async function getAdobeEcommerceMenuWeekly(
  date: Date,
  restaurantName: RestaurantName,
  periodId: number,
): Promise<DateDishMap | null> {
  const getLocationRecipesWeeklyVariables = {
    date: toISODateString(date),
    locationUrlKey: restaurantUrlMap[restaurantName],
    mealPeriod: periodId,
    viewType: "WEEKLY",
  } as GetLocationRecipesWeeklyVariables;

  const res = await queryAdobeECommerce(
    GetLocationRecipesWeeklyQuery,
    getLocationRecipesWeeklyVariables,
  );

  const parsedData: LocationRecipesWeekly =
    GetLocationRecipesWeeklySchema.parse(res.data);
  const products = parsedData.data.getLocationRecipes.products;
  const locationRecipesMap =
    parsedData.data.getLocationRecipes.locationRecipesMap;

  if (products == null || locationRecipesMap == null) return null;

  const parsedProducts = parseProducts(products.items);
  const dateSkuMap = locationRecipesMap.dateSkuMap;

  const dishes: DateDishMap = new Map<
    string,
    InsertDishWithModifiedRelations[]
  >();

  for (const { date, stations } of dateSkuMap) {
    for (const { id: stationId, skus } of stations) {
      for (const sku of skus.simple) {
        const item = parsedProducts[sku];

        const dish = {
          id: sku,
          name: item?.name ?? "UNIDENTIFIED",
          stationId: stationId.toString(),
          description: item?.description ?? "",
          category: item?.category ?? "",
          ingredients: item?.ingredients ?? "",
          nutritionInfo: item?.nutritionInfo ?? {},
          recipeAllergenCodes: item?.allergenIntolerances ?? new Set<number>(),
          recipePreferenceCodes: item?.recipePreferences ?? new Set<number>(),
        } as InsertDishWithModifiedRelations;

        const dishesForDate = dishes.get(date);
        if (dishesForDate) {
          dishesForDate.push(dish);
        } else {
          dishes.set(date, [dish]);
        }
      }
    }
  }

  return dishes;
}

type WeeklyProducts = NonNullable<
  LocationRecipesWeekly["data"]["getLocationRecipes"]["products"]
>["items"];

type ProductAttributes = {
  name: string;
  description: string;
  category: string;
  ingredients: string;
  allergenIntolerances: Set<number>;
  recipePreferences: Set<number>;
  nutritionInfo: InsertDishWithRelations["nutritionInfo"];
};

type ProductDictionary = { [sku: string]: ProductAttributes };

const parseNumericAttribute = (value: unknown): string | null => {
  if (typeof value === "number")
    return Number.isFinite(value) ? `${value}` : null;
  if (typeof value !== "string") return null;
  const match = value.match(/-?\d+(\.\d+)?/);
  return match ? match[0] : null;
};

/**
 * Parses the product attributes found in {@link WeeklyProducts} into a
 * more-conveniently accessible {@link ProductDictionary}
 * @param products An array of weekly products
 * @returns a dictionary associating the SKU of the product to its attributes
 */
function parseProducts(products: WeeklyProducts): ProductDictionary {
  const parsedProducts: ProductDictionary = {};

  products.forEach((product) => {
    const attributesMap = new Map(
      product.attributes.map((attr) => [attr.name, attr.value]),
    );

    const unparsedIntolerances = attributesMap.get("allergens_intolerances");
    const allergenIntolerances: Set<number> = new Set<number>();

    // Allergen intolerances can either be one singular value or an array.
    if (Array.isArray(unparsedIntolerances)) {
      unparsedIntolerances.forEach((code) => {
        allergenIntolerances.add(Number.parseInt(code, 10));
      });
    } else {
      allergenIntolerances.add(
        Number.parseInt((unparsedIntolerances as string) ?? "0", 10),
      );
    }

    const unparsedPreferences = attributesMap.get("recipe_attributes");
    const recipePreferences: Set<number> = new Set<number>();

    if (Array.isArray(unparsedPreferences)) {
      unparsedPreferences.forEach((code) => {
        recipePreferences.add(Number.parseInt(code, 10));
      });
    } else {
      recipePreferences.add(
        Number.parseInt((unparsedPreferences as string) ?? "0", 10),
      );
    }

    const servingCombined = attributesMap.get("serving_combined") as
      | string
      | undefined;
    const servingSize = servingCombined?.split(" ")[0];
    const servingUnit = servingCombined?.split(" ")[1];

    const nutritionInfo = {
      dishId: product.sku,
      calories: parseNumericAttribute(attributesMap.get("calories")),
      sodiumMg: parseNumericAttribute(attributesMap.get("sodium")),
      totalFatG: parseNumericAttribute(attributesMap.get("total_fat")),
      transFatG: parseNumericAttribute(attributesMap.get("trans_fat")),
      saturatedFatG: parseNumericAttribute(attributesMap.get("saturated_fat")),
      sugarsG: parseNumericAttribute(attributesMap.get("sugars")),
      ironMg: parseNumericAttribute(attributesMap.get("iron")),
      cholesterolMg: parseNumericAttribute(attributesMap.get("cholesterol")),
      totalCarbsG: parseNumericAttribute(
        attributesMap.get("total_carbohydrates"),
      ),
      dietaryFiberG: parseNumericAttribute(attributesMap.get("dietary_fiber")),
      proteinG: parseNumericAttribute(attributesMap.get("protein")),
      calciumMg: parseNumericAttribute(attributesMap.get("calcium")),
      vitaminAIU: parseNumericAttribute(attributesMap.get("vitamin_a")),
      vitaminCIU: parseNumericAttribute(attributesMap.get("vitamin_c")),
      servingSize: servingSize ?? "",
      servingUnit: servingUnit ?? "",
      // possible to get vitamins B and D and potassium in
      // attributes["recipe_additional_data"]
    } as InsertDishWithRelations["nutritionInfo"];

    parsedProducts[product.sku] = {
      name: product.name,
      description: (attributesMap.get("marketing_description") as string) ?? "",
      category: (attributesMap.get("master_recipe_type") as string) ?? "",
      ingredients: (attributesMap.get("recipe_ingredients") as string) ?? "",
      allergenIntolerances,
      recipePreferences,
      nutritionInfo,
    };
  });

  return parsedProducts;
}

/**
 * Takes in data in the form "Mo-Fr 07:15-11:00; Sa-Su 09:00-11:00"
 */
function parseOpeningHours(hoursString: string): [WeekTimes, WeekTimes] {
  const DAY_MAP: { [key: string]: number } = {
    Su: 0,
    Mo: 1,
    Tu: 2,
    We: 3,
    Th: 4,
    Fr: 5,
    Sa: 6,
  };

  const openingTime: string[] = new Array(7).fill("");
  const closingTime: string[] = new Array(7).fill("");

  const timeBlocks = hoursString
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const block of timeBlocks) {
    // Example: block = "Mo-Fr 07:15-11:00"
    const parts = block.split(/\s+/); // Split by one or more spaces

    if (parts.length < 2) {
      console.warn(
        `[parseOpeningHours]: Skipping invalid time block format: ${block}`,
      );
      continue;
    }

    const dayRangeStr = parts[0]; // "Mo-Fr"
    const timeRangeStr = parts[1]; // "07:15-11:00 OR off"

    if (!dayRangeStr || !timeRangeStr) continue;

    // If the timeRange is off, then we need not do anything (it is not open)
    if (timeRangeStr === "off") continue;

    const [openTime, closeTime] = timeRangeStr.split("-"); // "07:15", "11:00"

    if (!openTime || !closeTime) {
      console.warn(
        `[parseOpeningHours]: Skipping block with incomplete time range: ${block}`,
      );
      continue;
    }

    const dayIndices: number[] = [];

    // Case: Day Range (e.g., "Mo-Fr")
    if (dayRangeStr.includes("-")) {
      const dayParts = dayRangeStr.split("-");

      if (dayParts.length < 2) {
        console.warn(
          `[parseOpeningHours]: Skipping block with malformed day range: ${dayRangeStr}}`,
        );
        continue;
      }

      const startDay = dayParts[0];
      const endDay = dayParts[1];

      if (!startDay || !endDay) continue;

      const startIndex = DAY_MAP[startDay];
      const endIndex = DAY_MAP[endDay];

      if (startIndex === undefined || endIndex === undefined) {
        console.warn(`Skipping block with unknown day range: ${dayRangeStr}`);
        continue;
      }

      // handles if date range wraps around (i.e. Mo-Su)
      if (startIndex <= endIndex) {
        for (let i = startIndex; i <= endIndex; i++) dayIndices.push(i);
      } else {
        for (let i = startIndex; i < 7; i++) dayIndices.push(i);
        for (let i = 0; i <= endIndex; i++) dayIndices.push(i);
      }

      // Case: Single Day (e.g., "Mo")
    } else {
      const singleIndex = DAY_MAP[dayRangeStr];
      if (singleIndex !== undefined) {
        dayIndices.push(singleIndex);
      } else {
        console.warn(`Skipping block with unknown single day: ${dayRangeStr}`);
        continue;
      }
    }

    // Apply the times to the array indices
    for (const index of dayIndices) {
      openingTime[index] = openTime;
      closingTime[index] = closeTime;
    }
  }

  // Return the result, casting to the required fixed-length tuple type
  return [openingTime as WeekTimes, closingTime as WeekTimes];
}

function parseEventDate(
  dateStr: string | null,
  time: string | null,
): Date | null {
  if (!dateStr || !time) return null;
  return new Date(`${dateStr}T${time}`);
}
/**
 * Fetches list of events for a given location
 * Returns list of InsertEvent objects to be upserted into DB
 */
export async function getAEMEvents(
  location: AEMEventListQueryRestaurant,
): Promise<InsertEvent[]> {
  const queryFilter = {
    filter: {
      campus: {
        _expressions: {
          _operator: "EQUALS",
          value: "campus",
        },
      },
      location: {
        name: {
          _expressions: {
            _operator: "EQUALS",
            value: location,
          },
        },
      },
    } as AEMEventListQueryVariables,
  };

  const response = await queryAdobeECommerce(AEMEventListQuery, queryFilter);
  const data: EventList = AEMEventListSchema.parse(response.data);
  const events = data.data.AEM_eventList.items;
  const restaurantID = getRestaurantId(restaurantMap[location]);

  return events.map((e) => {
    const startDate = parseEventDate(e.startDate, e.startTime);
    const endDate = e.endTime
      ? parseEventDate(e.endDate ?? e.startDate, e.endTime)
      : null;

    return {
      title: e.title,
      image: null,
      restaurantId: restaurantID,
      shortDescription: null,
      longDescription: e.description.markdown,
      start: startDate,
      end: endDate,
    };
  });
}

const restaurantMap = {
  "The Anteatery": "anteatery",
  Brandywine: "brandywine",
} as const;

export const restaurantUrlMap = {
  anteatery: "the-anteatery",
  brandywine: "brandywine",
} as const;

// Helper to format date to YYYY-MM-DD, ensuring month and day are 2 digits.
const toISODateString = (d: Date) => {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
