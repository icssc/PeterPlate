import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userAllergies = pgTable(
  "user_allergies",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    allergy: text("allergy").notNull(),
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
