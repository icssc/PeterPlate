import { numeric, pgTable, text } from "drizzle-orm/pg-core";

import { dishes } from "./dishes";
import { metadataColumns } from "./utils";

export const nutritionInfos = pgTable("nutrition_infos", {
  dishId: text("dish_id")
    .primaryKey()
    .references(() => dishes.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  servingSize: text("serving_size"),
  servingUnit: text("serving_unit"),
  calories: numeric("calories", { precision: 10, scale: 2 }),
  totalFatG: numeric("total_fat_g", { precision: 10, scale: 2 }),
  transFatG: numeric("trans_fat_g", { precision: 10, scale: 2 }),
  saturatedFatG: numeric("saturated_fat_g", { precision: 10, scale: 2 }),
  cholesterolMg: numeric("cholesterol_mg", { precision: 10, scale: 2 }),
  sodiumMg: numeric("sodium_mg", { precision: 10, scale: 2 }),
  totalCarbsG: numeric("total_carbs_g", { precision: 10, scale: 2 }),
  dietaryFiberG: numeric("dietary_fiber_g", { precision: 10, scale: 2 }),
  sugarsG: numeric("sugars_g", { precision: 10, scale: 2 }),
  proteinG: numeric("protein_g", { precision: 10, scale: 2 }),
  calciumMg: numeric("calcium", { precision: 10, scale: 2 }),
  ironMg: numeric("iron", { precision: 10, scale: 2 }),
  vitaminAIU: numeric("vitamin_a", { precision: 10, scale: 2 }),
  vitaminCIU: numeric("vitamin_c", { precision: 10, scale: 2 }),
  ...metadataColumns,
});

/** The nutrition information of a dish. */
export type InsertNutritionInfo = typeof nutritionInfos.$inferInsert;
export type SelectNutritionInfo = typeof nutritionInfos.$inferSelect;
