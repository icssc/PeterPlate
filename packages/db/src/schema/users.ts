import { relations } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { favorites } from "./favorites";
import { ratings } from "./ratings";
import { metadataColumns } from "./utils";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  ...metadataColumns,
});

export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
  ratings: many(ratings),
}));

/**
 * A user of the app.
 *
 * A user has many:
 *
 * {@linkcode favorites}
 * {@linkcode ratings}
 *
 */
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export const UserSchema = createInsertSchema(users);
