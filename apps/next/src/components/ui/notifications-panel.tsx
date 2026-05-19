"use client";

import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { Box, Switch, Typography } from "@mui/material";
import { useState } from "react";
import { useSession } from "@/utils/auth-client";
import { trpc } from "@/utils/trpc";

export default function NotificationsPanel({ onBack }: { onBack: () => void }) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  const { data: notifications } =
    trpc.notification.getSavedNotifications.useQuery(
      { userId },
      { enabled: !!userId },
    );

  const { data: subscription } = trpc.notification.getSubscription.useQuery(
    { userId },
    { enabled: !!userId },
  );

  const updateSubscriptionMutation =
    trpc.notification.updateSubscription.useMutation();

  const [dishNotifs, setDishNotifs] = useState(
    subscription?.isSubscribedFoodFavorites ?? false,
  );
  const [eventNotifs, setEventNotifs] = useState(
    subscription?.isSubscribedEvents ?? false,
  );

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
            <Typography
              variant="caption"
              className="text-zinc-500 dark:text-zinc-400"
            >
              {notifications?.filter((n) => !n.isRead).length ?? 0} Unread
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

      {/* Notification list from saved_notifications table */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
        {notifications?.length ? (
          notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3 px-5 py-3">
              <div
                className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? "bg-red-500" : "bg-transparent"}`}
              />
              <Typography
                variant="body2"
                color="text.primary"
                className="flex-1"
              >
                {n.message}
              </Typography>
              <Typography
                variant="caption"
                className="shrink-0 ml-2 text-zinc-500 dark:text-zinc-400"
              >
                {new Date(n.createdAt).toLocaleDateString()}
              </Typography>
            </div>
          ))
        ) : (
          <div className="px-5 py-4">
            <Typography
              variant="caption"
              className="text-zinc-500 dark:text-zinc-400"
            >
              No notifications yet.
            </Typography>
          </div>
        )}
      </div>

      {/* Toggles — wired to push_subscriptions.isSubscribedFoodFavorites / isSubscribedEvents */}
      <div className="px-5 pb-5 pt-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Dish Notifications
          </Typography>
          <Switch
            checked={dishNotifs}
            onChange={(e) => {
              setDishNotifs(e.target.checked);
              updateSubscriptionMutation.mutate({
                userId,
                isSubscribedFoodFavorites: e.target.checked,
              });
            }}
            size="small"
          />
        </div>
        <div className="flex items-center justify-between">
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Event Notifications
          </Typography>
          <Switch
            checked={eventNotifs}
            onChange={(e) => {
              setEventNotifs(e.target.checked);
              updateSubscriptionMutation.mutate({
                userId,
                isSubscribedEvents: e.target.checked,
              });
            }}
            size="small"
          />
        </div>
      </div>
    </Box>
  );
}
