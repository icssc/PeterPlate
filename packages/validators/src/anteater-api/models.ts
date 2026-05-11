import { z } from "zod";

// Represents the schema of the response from bulk dish retrieval.
export const retrieveDishesByIdResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  data: z.array(
    z.object({
      id: z.string(),
      stationId: z.string(),
      name: z.string(),
      description: z.string(),
      ingredients: z.string(),
      category: z.string(),
      imageUrl: z.string().nullable(),
      updatedAt: z.coerce.date(),
      dietRestriction: z.object({
        containsEggs: z.boolean(),
        containsFish: z.boolean(),
        containsMilk: z.boolean(),
        containsPeanuts: z.boolean(),
        containsSesame: z.boolean(),
        containsShellfish: z.boolean(),
        containsSoy: z.boolean(),
        containsTreeNuts: z.boolean(),
        containsWheat: z.boolean(),
        isGlutenFree: z.boolean(),
        isHalal: z.boolean(),
        isKosher: z.boolean(),
        isLocallyGrown: z.boolean(),
        isOrganic: z.boolean(),
        isVegan: z.boolean(),
        isVegetarian: z.boolean(),
      }),
      nutritionInfo: z.object({
        servingSize: z.string(),
        servingUnit: z.string(),
        calories: z.number().nullable(),
        totalFatG: z.number().nullable(),
        transFatG: z.number().nullable(),
        saturatedFatG: z.number().nullable(),
        cholesterolMg: z.number().nullable(),
        sodiumMg: z.number().nullable(),
        totalCarbsG: z.number().nullable(),
        dietaryFiberG: z.number().nullable(),
        sugarsG: z.number().nullable(),
        proteinG: z.number().nullable(),
        calciumMg: z.number().nullable(),
        ironMg: z.number().nullable(),
        vitaminAIU: z.number().nullable(),
        vitaminCIU: z.number().nullable(),
      }),
    }),
  ),
});

export const getDiningEventsResponseSchema = z.object({
  ok: z.boolean(),
  data: z.array(
    z.object({
      title: z.string(),
      image: z.string(),
      restaurantId: z.enum(["brandywine", "anteatery"]),
      description: z.string(),
      start: z.coerce.date(),
      end: z.coerce.date(),
      updatedAt: z.coerce.date(),
    }),
  ),
});

export const getDateRangeOfAvailableDiningDataResponseSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    earliest: z.coerce.date(),
    latest: z.coerce.date(),
  }),
});

export const getRestaurantsResponseSchema = z.object({
  ok: z.boolean(),
  data: z.array(
    z.object({
      id: z.enum(["brandywine", "anteatery"]),
      updatedAt: z.coerce.date(),
      stations: z.array(
        z.object({
          id: z.coerce.number(),
          name: z.string(),
          updatedAt: z.coerce.date(),
        }),
      ),
    }),
  ),
});

export const getStateForRestaurantOnDayResponseSchema = z.object({
  ok: z.boolean(),
  data: z.object({
    id: z.enum(["brandywine", "anteatery"]),
    updatedAt: z.coerce.date(),
    periods: z.record(
      z.string().uuid(),
      z.object({
        name: z.string(),
        startTime: z.string().time().nullable(),
        endTime: z.string().time().nullable(),
        stationToDishes: z.record(z.coerce.number(), z.array(z.string())),
      }),
    ),
  }),
});

export type Dish = z.infer<typeof retrieveDishesByIdResponseSchema>["data"][0];
export type DishWithRating = Dish & { totalRating: number; numRatings: number };
export type DietaryRestrictions = Dish["dietRestriction"];

export type Event = z.infer<typeof getDiningEventsResponseSchema>["data"][0];
export type RestaurantInfo = z.infer<
  typeof getStateForRestaurantOnDayResponseSchema
>["data"];
export type Period = RestaurantInfo["periods"][""];
