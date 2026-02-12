import { z } from "zod";

export const MenuStationSchema = z.object({
  StationId: z.string().min(1),
  Name: z.string().min(1),
});

export const MenuProductSchema = z.object({
  ProductId: z.string().min(1),
  StationId: z.string().min(1),
  Product: z.object({
    MarketingName: z.string().min(1),
    Categories: z.array(z.object({ DisplayName: z.string().min(1) })).min(1),
    ShortDescription: z.string(),
    DietaryInformation: z.array(
      z.object({
        IconUrl: z.string(),
        Name: z.string(),
        isEnabled: z.boolean().optional(),
      }),
    ),
    // Dietary Restrictions
    AvailableFilters: z.object({
      ContainsEggs: z.boolean().nullable().optional(),
      ContainsFish: z.boolean().nullable().optional(),
      ContainsMilk: z.boolean().nullable().optional(),
      ContainsPeanuts: z.boolean().nullable().optional(),
      ContainsSesame: z.boolean().nullable().optional(),
      ContainsShellfish: z.boolean().nullable().optional(),
      ContainsSoy: z.boolean().nullable().optional(),
      ContainsTreeNuts: z.boolean().nullable().optional(),
      ContainsWheat: z.boolean().nullable().optional(),
    }),
    IngredientStatement: z.string(),
    // Nutrition Info object
    NutritionalTree: z.array(
      z.object({
        Name: z.string(),
        Value: z.string().nullable(),
        Unit: z.string().nullable(),
        SubList: z
          .array(
            z.object({
              Name: z.string(),
              Value: z.string().nullable(),
              Unit: z.string().nullable(),
            }),
          )
          .nullable(),
      }),
    ),
    ServingSize: z.string().nullable(),
    ServingUnit: z.string().nullable(),
    Calories: z.string().nullable(),
  }),
});

/* Represents the response returned from the GetMenuPeriods query. */
export const PeriodSchema = z.object({
  Time: z.string().time(), // Time of request
  Result: z.array(
    z.object({
      PeriodId: z.number(),
      PeriodName: z.string(),
      UtcMealPeriodStartTime: z.string().time(),
      UtcMealPeriodEndTime: z.string().time(),
    }),
  ),
});

export type CampusDishMenuProduct = z.infer<typeof MenuProductSchema>;
export type CampusDishPeriodResult = z.infer<typeof PeriodSchema>;
