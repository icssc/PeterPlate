import { z } from "zod";

export const NutritionGoalsSchema = z.object({
  calorieGoal: z
    .number()
    .int()
    .min(100, "Calories must be at least 100")
    .max(10000, "Calories cannot exceed 10,000"),

  proteinGoal: z
    .number()
    .int()
    .min(1, "Protein must be at least 1")
    .max(500, "Protein cannot exceed 500"),

  carbGoal: z
    .number()
    .int()
    .min(1, "Carbs must be at least 1")
    .max(1000, "Carbs cannot exceed 1,000"),

  fatGoal: z
    .number()
    .int()
    .min(1, "Fat must be at least 1")
    .max(500, "Fat cannot exceed 500"),
});
