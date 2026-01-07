import { z } from "zod";

/* Represents the schema of the return data from query AEM_eventList */
export const AEMEventListSchema = z.object({
  data: z.object({
    AEM_eventList: z.object({
      items: z.array(
        z.object({
          title: z.string().min(1),
          subtitle: z.string().min(1),
          description: z.object({
            markdown: z.string(),
          }),
          startDate: z.string().date().nullable(),
          endDate: z.string().date().nullable(),
          startTime: z.string().time().nullable(),
          endTime: z.string().time().nullable(),
        }),
      ),
    }),
  }),
});

/* Represents the schema of the return data from query getLocationRecipes
 * for a daily query
 */
export const GetLocationRecipesDailySchema = z.object({
  data: z.object({
    getLocationRecipes: z.object({
      locationRecipesMap: z
        .object({
          stationSkuMap: z.array(
            z.object({
              id: z.number(),
              skus: z.array(z.string()).nonempty(),
            }),
          ),
        })
        .nullable(),
      products: z
        .object({
          items: z.array(
            z.object({
              sku: z.string(),
              name: z.string(),
              images: z.array(
                z.object({
                  url: z.string(),
                }),
              ),
              attributes: z.array(
                z.object({
                  name: z.string(),
                  value: z.union([z.string(), z.array(z.string())]),
                }),
              ),
            }),
          ),
        })
        .nullable(),
    }),
  }),
});

export const GetLocationRecipesWeeklySchema = z.object({
  data: z.object({
    getLocationRecipes: z.object({
      locationRecipesMap: z
        .object({
          dateSkuMap: z.array(
            z.object({
              date: z.string().date(),
              stations: z.array(
                z.object({
                  id: z.number(),
                  skus: z.object({
                    simple: z.array(z.string()),
                  }),
                }),
              ),
            }),
          ),
        })
        .nullable(),
      products: z
        .object({
          items: z.array(
            z.object({
              sku: z.string(),
              name: z.string(),
              images: z.array(
                z.object({
                  url: z.string(),
                }),
              ),
              attributes: z.array(
                z.object({
                  name: z.string(),
                  value: z.union([z.string(), z.array(z.string())]),
                }),
              ),
            }),
          ),
        })
        .nullable(),
    }),
  }),
});

export const GetLocationSchema = z.object({
  data: z.object({
    Commerce_mealPeriods: z.array(
      z.object({
        name: z.string(),
        id: z.number(),
        position: z.number(),
      }),
    ),
    Commerce_attributesList: z.object({
      items: z.array(
        z.object({
          code: z.string(),
          options: z.array(
            z.object({
              value: z.string(),
              label: z.string(),
            }),
          ),
        }),
      ),
    }),
    getLocation: z.object({
      commerceAttributes: z.object({
        maxMenusDate: z.string().date(),
        children: z.array(
          z.object({
            id: z.number(),
            uid: z.string(),
            name: z.string(),
            position: z.number(),
          }),
        ),
      }),
      aemAttributes: z.object({
        hoursOfOperation: z.object({
          schedule: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              type: z.string(),
              meal_periods: z.array(
                z.object({
                  meal_period: z.string(),
                  opening_hours: z.string(),
                }),
              ),
              start_date: z.string().date().optional(),
              end_date: z.string().date().optional(),
            }),
          ),
        }),
      }),
    }),
  }),
});

export const EventImageSchema = z.object({
  data: z.object({
    eventList: z.object({
      items: z.array(
        z.object({
          title: z.string().min(1),
          image: z.object({
            _dynamicUrl: z.string(),
            height: z.number(),
            width: z.number(),
          }),
        }),
      ),
    }),
  }),
});

// Inferred types from zod
export type EventList = z.infer<typeof AEMEventListSchema>;
export type LocationRecipesDaily = z.infer<
  typeof GetLocationRecipesDailySchema
>;
export type LocationRecipesWeekly = z.infer<
  typeof GetLocationRecipesWeeklySchema
>;
export type LocationInfo = z.infer<typeof GetLocationSchema>;
export type MealPeriod = LocationInfo["data"]["Commerce_mealPeriods"][0];
export type EventImageData = z.infer<typeof EventImageSchema>;

export type Schedule = {
  name: string;
  type: string;
  startDate?: Date;
  endDate?: Date;
  mealPeriods: MealPeriodWithHours[];
};
// Indexed starting with Sunday-Saturday
export type WeekTimes = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
export type MealPeriodWithHours = MealPeriod & {
  // The hours for which the meal period opens (e.g. openHours[day] = "11:00")
  openHours: WeekTimes;
  // The hours for which the meal period occurs (e.g. openHours[day] = "14:00")
  closeHours: WeekTimes;
};
export type DiningHallInformation = {
  // Maps the allergen (e.g. "Eggs") to its code (39)
  allergenIntoleranceCodes: { [allergen: string]: number };
  // Maps the preference (e.g. "Gluten Free") to its code (78)
  menuPreferenceCodes: { [preference: string]: number };
  // Maps the id of the station to station name
  stationsInfo: { [uid: string]: string };
  // Schedules (special and standard) for this dining hall
  schedules: Schedule[];
};

// The keys for reading allergen intolerances from the API response's attributes
export const AllergenKeys = [
  "Eggs",
  "Fish",
  "Milk",
  "Peanuts",
  "Sesame",
  "Shellfish",
  "Soy",
  "Tree Nuts",
  "Wheat",
] as const;

// The keys for reading preferences from the API response's attributes
export const PreferenceKeys = [
  "Gluten Free",
  "Halal",
  "Kosher",
  "Locally Grown",
  "Organic", // in dietRestriction schema but not returned by API
  "Vegan",
  "Vegetarian",
] as const;
