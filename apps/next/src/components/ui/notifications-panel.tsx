"use client";

import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { Box, Switch, Typography } from "@mui/material";
import { useState } from "react";

export default function NotificationsPanel({ onBack }: { onBack: () => void }) {
  // TODO: Add userId prop when wiring to DB
  // TODO: Replace with trpc.notification.getSavedNotifications.useQuery({ userId })
  // TODO: Replace with trpc.notification.getSubscription.useQuery({ userId }) for toggle initial values
  const [dishNotifs, setDishNotifs] = useState(false);
  const [eventNotifs, setEventNotifs] = useState(false);

  return (
    <Box
      className="w-full h-full rounded-2xl bg-white dark:bg-[#323235] shadow-xl flex flex-col"
      sx={{ border: 1, borderColor: "divider" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowBackIcon sx={{ fontSize: 18, color: "text.primary" }} />
          </button>
          <Box sx={{ color: "primary.main", display: "flex" }}>
            <NotificationsIcon />
          </Box>
          <div>
            <Typography variant="body1" fontWeight={600} color="text.primary">
              Notifications
            </Typography>
            {/* TODO: Replace 0 with unreadCount from query */}
            <Typography
              variant="caption"
              className="text-zinc-500 dark:text-zinc-400"
            >
              0 Unread
            </Typography>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <CloseIcon sx={{ fontSize: 18, color: "text.primary" }} />
        </button>
      </div>

      {/* Placeholder list — replace with real data from saved_notifications table */}
      {/* Each item: { id, message, createdAt, isRead, type } */}
      {/* On click: trpc.notification.markAsRead.mutate({ id }) */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
        {[
          {
            id: "1",
            text: "Chicken Teriyaki is being served in Brandywine today at Lunch!",
            date: "Today",
            unread: true,
          },
          {
            id: "2",
            text: "Chicken Teriyaki is being served in Brandywine today at Lunch!",
            date: "Thursday",
            unread: true,
          },
          {
            id: "3",
            text: "Friendsgiving is happening in Anteatery today from 11:00 AM - 3:00 PM!",
            date: "January 30",
            unread: true,
          },
          {
            id: "4",
            text: "Chicken Teriyaki is being served in Brandywine today at Lunch!",
            date: "January 14",
            unread: false,
          },
          {
            id: "5",
            text: "Chicken Teriyaki is being served in Brandywine today at Lunch!",
            date: "January 10",
            unread: false,
          },
        ].map((n) => (
          <div key={n.id} className="flex items-start gap-3 px-5 py-3">
            <div
              className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.unread ? "bg-red-500" : "bg-transparent"}`}
            />
            <Typography variant="body2" color="text.primary" className="flex-1">
              {n.text}
            </Typography>
            <Typography
              variant="caption"
              className="shrink-0 ml-2 text-zinc-500 dark:text-zinc-400"
            >
              {n.date}
            </Typography>
          </div>
        ))}
      </div>

      {/* Toggles — wire to push_subscriptions.isSubscribedFoodFavorites / isSubscribedEvents */}
      <div className="px-5 pb-5 pt-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Dish Notifications
          </Typography>
          {/* TODO: trpc.notification.updateSubscription.mutate({ userId, isSubscribedFoodFavorites }) */}
          <Switch
            checked={dishNotifs}
            onChange={(e) => setDishNotifs(e.target.checked)}
            size="small"
          />
        </div>
        <div className="flex items-center justify-between">
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Event Notifications
          </Typography>
          {/* TODO: trpc.notification.updateSubscription.mutate({ userId, isSubscribedEvents }) */}
          <Switch
            checked={eventNotifs}
            onChange={(e) => setEventNotifs(e.target.checked)}
            size="small"
          />
        </div>
      </div>
    </Box>
  );
}
