import { pgTable, uuid, timestamp, real, text, check, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { dishes } from "./dishes";

export const loggedMeals = pgTable("logged_meals", {
  // composite primary key (userId, dishId)  
  userId: text("user_id").notNull()
      .references(() => users.id, {
        onDelete: "cascade"
      }),
    dishId: text("dish_id").notNull()
      .references(() => dishes.id, {
        onDelete: "cascade"
      }),
    dishName: text("dish_name").notNull(),
    servings: real("servings").default(1).notNull(),
    eatenAt: timestamp("eaten_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({columns: [table.userId, table.dishId]}),
    servingsIsValid: check(
      "servings_is_valid",
      // Must be >= 0.5 AND a multiple of 0.5
      sql`((${table.servings} * 2) % 1 = 0) AND (${table.servings} >= 0.5)`
    )
  })
);

export type InsertLoggedMeal = typeof loggedMeals.$inferInsert;
export type SelectLoggedMeal = typeof loggedMeals.$inferSelect;
