import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userGoals = pgTable("user_goals", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  calorieGoal: integer("calorie_goal").notNull().default(2000),
  proteinGoal: integer("protein_goal").notNull().default(100),
  carbGoal: integer("carb_goal").notNull().default(250),
  fatGoal: integer("fat_goal").notNull().default(50),
});

export type InsertUserGoals = typeof userGoals.$inferInsert;
export type SelectUserGoals = typeof userGoals.$inferSelect;
