import { relations } from "drizzle-orm";
import { pgEnum, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const preferenceEnum = pgEnum("preference", [
  "glutenFree",
  "halal",
  "kosher",
  "locallyGrown",
  "organic",
  "vegan",
  "vegetarian",
]);

export const userDietaryPreferences = pgTable(
  "user_dietary_preferences",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    preference: preferenceEnum("preference").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.preference] }),
  }),
);

export const userDietaryPreferencesRelations = relations(
  userDietaryPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [userDietaryPreferences.userId],
      references: [users.id],
    }),
  }),
);

export type InsertPreference = typeof userDietaryPreferences.$inferInsert;
export type SelectPreference = typeof userDietaryPreferences.$inferSelect;

export type UserDietaryPreference = NonNullable<InsertPreference["preference"]>;
