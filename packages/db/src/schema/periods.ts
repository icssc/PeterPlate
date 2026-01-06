import { date, pgTable, primaryKey, text, time } from "drizzle-orm/pg-core";
import { restaurantIdEnum } from "./enums";
import { restaurants } from "./restaurants";
import { metadataColumns } from "./utils";

export const periods = pgTable(
  "periods",
  {
    id: text("id").notNull(),
    date: date("date").notNull(),
    restaurantId: restaurantIdEnum("restaurant_id")
      .notNull()
      .references(() => restaurants.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    startTime: time("start").notNull(),
    endTime: time("end").notNull(),
    name: text("name").notNull(),
    ...metadataColumns,
  },
  (table) => ({
    pk: primaryKey({
      name: "periods_pk",
      columns: [table.id, table.date, table.restaurantId],
    }),
  }),
);

/** A meal period, e.g. breakfast. */
export type InsertPeriod = typeof periods.$inferInsert;
export type SelectPeriod = typeof periods.$inferSelect;
