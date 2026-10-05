import { date, integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userGoalsByDay = pgTable(
  "user_goals_by_day",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    calorieGoal: integer("calorie_goal").notNull().default(2000),
    proteinGoal: integer("protein_goal").notNull().default(100),
    carbGoal: integer("carb_goal").notNull().default(250),
    fatGoal: integer("fat_goal").notNull().default(50),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.date] }),
  }),
);
