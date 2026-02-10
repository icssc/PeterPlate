import { relations } from "drizzle-orm";
import { index, pgTable, text } from "drizzle-orm/pg-core";

import { dishes } from "./dishes";
import { restaurantIdEnum } from "./enums";
import { restaurants } from "./restaurants";
import { metadataColumns } from "./utils";

export const stations = pgTable(
  "stations",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    restaurantId: restaurantIdEnum("restaurant_id")
      .notNull()
      .references(() => restaurants.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    ...metadataColumns,
  },
  (table) => ({
    restaurantIdx: index("stations_restaurant_id_idx").on(table.restaurantId),
  }),
);

export const stationsRelations = relations(stations, ({ one, many }) => ({
  dishes: many(dishes),
  restaurant: one(restaurants, {
    fields: [stations.restaurantId],
    references: [restaurants.id],
  }),
}));

/**
 * A station of a restaurant.
 *
 * A station has many:
 *
 * {@linkcode dishes}
 */
export type InsertStation = typeof stations.$inferInsert;
export type SelectStation = typeof stations.$inferSelect;
