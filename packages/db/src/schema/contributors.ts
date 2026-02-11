import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { metadataColumns } from "./utils";

export const contributors = pgTable("contributors", {
    login: text("login").primaryKey(),
    avatar_url: text("avatar_url").notNull(),
    contributions: integer("contributions").notNull(),
    name: text("name"),
    bio: text("bio").default("PeterPlate Contributor"),
    ...metadataColumns,
});

export type InsertContributor = typeof contributors.$inferInsert;
export type SelectContributor = typeof contributors.$inferSelect;