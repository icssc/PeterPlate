import { integer, pgTable, text } from "drizzle-orm/pg-core";

import { metadataColumns } from "./utils";

export const dishes = pgTable("dishes", {
  id: text("id").primaryKey(),
  numRatings: integer("num_ratings").default(0).notNull(),
  totalRating: integer("total_rating").default(0).notNull(),
  ...metadataColumns,
});

/** A dish at a restaurant. */
export type InsertDish = typeof dishes.$inferInsert;
export type SelectDish = typeof dishes.$inferSelect;
