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
    }),
  ),
});

export type Dish = z.infer<typeof retrieveDishesByIdResponseSchema>["data"][0];
export type DishWithRating = Dish & { totalRating: number };
