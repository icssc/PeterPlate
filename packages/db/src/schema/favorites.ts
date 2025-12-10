import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { dishes } from "./dishes";
import { users } from "./users";
import { metadataColumns } from "./utils";

export const favorites = pgTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    dishId: text("dish_id")
      .notNull()
      .references(() => dishes.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    ...metadataColumns,
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.userId, table.dishId],
      }),
    };
  },
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
  dish: one(dishes, {
    fields: [favorites.dishId],
    references: [dishes.id],
  }),
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));

/**
 * A favorite a user has put on a dish.
 *
 * A favorite has one:
 *
 * {@linkcode dishes}
 * {@linkcode users}
 */
export type InsertFavorite = typeof favorites.$inferInsert;
export type SelectFavorite = typeof favorites.$inferSelect;

