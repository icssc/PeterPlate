import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./users";

export const notificationTypeEnum = pgEnum("notification_type", [
  "food",
  "event",
]);

export const savedNotifications = pgTable("saved_notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const savedNotificationsRelations = relations(
  savedNotifications,
  ({ one }) => ({
    user: one(users, {
      fields: [savedNotifications.userId],
      references: [users.id],
    }),
  }),
);

export const SavedNotificationSchema = createInsertSchema(savedNotifications);
export type InsertSavedNotification = typeof savedNotifications.$inferInsert;
export type SelectSavedNotification = typeof savedNotifications.$inferSelect;
