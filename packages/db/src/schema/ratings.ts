import { relations } from "drizzle-orm";
import { pgTable, primaryKey, real, text } from "drizzle-orm/pg-core"; // switched from smallint to real
import { createInsertSchema } from "drizzle-zod";

import { dishes } from "./dishes";
import { users } from "./users";
import { metadataColumns } from "./utils";

export const ratings = pgTable(
  "ratings",
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
    rating: real("rating").notNull(),
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

export const ratingsRelations = relations(ratings, ({ one }) => ({
  dish: one(dishes, {
    fields: [ratings.dishId],
    references: [dishes.id],
  }),
  user: one(users, {
    fields: [ratings.userId],
    references: [users.id],
  }),
}));

/**
 * A rating a user has given a dish.
 *
 * A rating has one:
 *
 * {@linkcode users}
 * {@linkcode dishes}
 */
export type InsertRating = typeof ratings.$inferInsert;
export type SelectRating = typeof ratings.$inferSelect;

export const RatingSchema = createInsertSchema(ratings);
