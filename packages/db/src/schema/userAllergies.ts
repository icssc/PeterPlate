import { relations } from "drizzle-orm";
import { pgEnum, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const allergyEnum = pgEnum("allergy", [
  "eggs",
  "fish",
  "milk",
  "peanuts",
  "sesame",
  "shellfish",
  "soy",
  "treeNuts",
  "wheat",
]);

export const userAllergies = pgTable(
  "user_allergies",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    allergy: allergyEnum("allergy").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.allergy] }),
  }),
);

export const userAllergyRelations = relations(userAllergies, ({ one }) => ({
  user: one(users, {
    fields: [userAllergies.userId],
    references: [users.id],
  }),
}));

export type InsertAllergy = typeof userAllergies.$inferInsert;
export type SelectAllergy = typeof userAllergies.$inferSelect;

export type UserAllergy = NonNullable<InsertAllergy["allergy"]>;
