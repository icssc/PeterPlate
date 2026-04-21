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
        calories: z.number(),
        totalFatG: z.number(),
        transFatG: z.number(),
        saturatedFatG: z.number(),
        cholesterolMg: z.number(),
        sodiumMg: z.number(),
        totalCarbsG: z.number(),
        dietaryFiberG: z.number(),
        sugarsG: z.number(),
        proteinG: z.number(),
        calciumMg: z.number(),
        ironMg: z.number(),
        vitaminAIU: z.number(),
        vitaminCIU: z.number(),
      }),
    }),
  ),
});

export type Dish = z.infer<typeof retrieveDishesByIdResponseSchema>["data"][0];
export type DishWithRating = Dish & { totalRating: number };
