import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./users";

export const pushSubscriptions = pgTable("push_subscriptions", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
});

export const pushSubscriptionsRelations = relations(
  pushSubscriptions,
  ({ one }) => ({
    user: one(users, {
      fields: [pushSubscriptions.userId],
      references: [users.id],
    }),
  }),
);

export const PushSubscriptionSchema = createInsertSchema(pushSubscriptions);
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;
export type SelectPushSubscription = typeof pushSubscriptions.$inferSelect;
