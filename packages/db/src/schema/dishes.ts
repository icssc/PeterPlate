import { relations } from "drizzle-orm";
import { index, integer, pgTable, text } from "drizzle-orm/pg-core";

import {
  dietRestrictions,
  type InsertDietRestriction,
} from "./dietRestrictions";
import { dishesToMenus } from "./menus";
import { type InsertNutritionInfo, nutritionInfos } from "./nutritionInfos";
import { stations } from "./stations";
import { metadataColumns } from "./utils";

export const dishes = pgTable(
  "dishes",
  {
    id: text("id").primaryKey(),
    stationId: text("station_id")
      .notNull()
      .references(() => stations.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    name: text("name").notNull(),
    description: text("description").notNull(),
    ingredients: text("ingredients").default(
      "Ingredient Statement Not Available",
    ),

    /** Defaults to "Other" if not specified. */
    category: text("category").notNull().default("Other"),

    // keep your feature: dishes can have an optional image url
    image_url: text("image_url"),

    numRatings: integer("num_ratings").default(0).notNull(),
    totalRating: integer("total_rating").default(0).notNull(),
    ...metadataColumns,
  },
  (table) => ({
    stationIdx: index("dishes_station_id_idx").on(table.stationId),
    nameIdx: index("dishes_name_idx").on(table.name),
    categoryIdx: index("dishes_category_idx").on(table.category),
  }),
);

export const dishRelations = relations(dishes, ({ one, many }) => ({
  dishesToMenus: many(dishesToMenus),
  station: one(stations, {
    fields: [dishes.stationId],
    references: [stations.id],
  }),
  dietRestriction: one(dietRestrictions, {
    fields: [dishes.id],
    references: [dietRestrictions.dishId],
  }),
  nutritionInfo: one(nutritionInfos, {
    fields: [dishes.id],
    references: [nutritionInfos.dishId],
  }),
}));

/** A dish at a restaurant. */
export type InsertDish = typeof dishes.$inferInsert;
export type SelectDish = typeof dishes.$inferSelect;
export interface InsertDishWithRelations extends InsertDish {
  dietRestriction: InsertDietRestriction;
  nutritionInfo: InsertNutritionInfo;
}
