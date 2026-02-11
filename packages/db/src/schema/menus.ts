import { relations, sql } from "drizzle-orm";
import {
  check,
  date,
  foreignKey,
  index,
  numeric,
  pgTable,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";

import { dishes } from "./dishes";
import { restaurantIdEnum } from "./enums";
import { periods } from "./periods";
import { restaurants } from "./restaurants";
import { metadataColumns } from "./utils";

export const menus = pgTable(
  "menus",
  {
    id: text("id").primaryKey(),
    periodId: text("period_id").notNull(),
    date: date("date", { mode: "string" }).notNull(),
    restaurantId: restaurantIdEnum("restaurant_id")
      .notNull()
      .references(() => restaurants.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    price: numeric("price", { precision: 6, scale: 2 }),
    ...metadataColumns,
  },
  (table) => ({
    restaurantDateIdx: index("menus_restaurant_date_idx").on(
      table.restaurantId,
      table.date,
    ),
    restaurantIdx: index("menus_restaurant_id_idx").on(table.restaurantId),
    dateIdx: index("menus_date_idx").on(table.date),
    periodIdx: index("menus_period_id_idx").on(table.periodId),
    periodFk: foreignKey({
      columns: [table.periodId, table.date, table.restaurantId],
      foreignColumns: [periods.id, periods.date, periods.restaurantId],
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
    priceNonNegative: check(
      "menus_price_nonnegative",
      sql`price IS NULL OR price >= 0`,
    ),
  }),
);

export const menusRelations = relations(menus, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menus.restaurantId],
    references: [restaurants.id],
  }),
  period: one(periods, {
    fields: [menus.periodId, menus.date],
    references: [periods.id, periods.date],
  }),
  dishesToMenus: many(dishesToMenus),
}));

/**
 * TODO: drizzle's upcoming relational api v2 will allow us to just specify a M2M relation
 * within the relations function above. Until then, it's a join table
 *
 * @see https://github.com/drizzle-team/drizzle-orm/discussions/2316
 *
 * @see https://orm.drizzle.team/docs/joins#many-to-many-example
 */
export const dishesToMenus = pgTable(
  "dishes_to_menus",
  {
    menuId: text("menu_id")
      .notNull()
      .references(() => menus.id),
    dishId: text("dish_id")
      .notNull()
      .references(() => dishes.id),
  },
  (table) => ({
    pk: primaryKey({
      name: "dishes_to_menus_pk",
      columns: [table.menuId, table.dishId],
    }),
  }),
);

export const dishesToMenusRelations = relations(dishesToMenus, ({ one }) => ({
  dish: one(dishes, {
    fields: [dishesToMenus.dishId],
    references: [dishes.id],
  }),
  menu: one(menus, {
    fields: [dishesToMenus.menuId],
    references: [menus.id],
  }),
}));

/** A restaurant menu for a given date and period. */
export type InsertMenu = typeof menus.$inferInsert;
export type SelectMenu = typeof menus.$inferSelect;
/** A join between a dish and a menu. */
export type DishToMenu = typeof dishesToMenus.$inferInsert;
/** List of dates we have menu data for. */
export type DateList = Date[] | null;
