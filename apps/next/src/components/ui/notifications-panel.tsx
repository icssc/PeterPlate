"use client";

import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/utils/auth-client";
import { trpc } from "@/utils/trpc";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function isPushSupported(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

async function ensurePushSubscription(): Promise<{
  endpoint: string;
  p256dh: string;
  auth: string;
}> {
  const registration = await navigator.serviceWorker.ready;
  let sub = await registration.pushManager.getSubscription();
  if (!sub) {
    sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        VAPID_PUBLIC_KEY,
      ) as BufferSource,
    });
  }
  const json = sub.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("Invalid push subscription keys generated.");
  }
  return {
    endpoint: json.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
  };
}

type ToggleKind = "food" | "event";

export default function NotificationsPanel({ onBack }: { onBack: () => void }) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  const utils = trpc.useUtils();

  const { data: notifications } =
    trpc.notification.getSavedNotifications.useQuery(
      { userId },
      { enabled: !!userId },
    );

  const { data: subscription, isLoading: subLoading } =
    trpc.notification.getSubscription.useQuery(
      { userId },
      { enabled: !!userId },
    );

  const subscribeMutation = trpc.notification.subscribe.useMutation();
  const updateSubscriptionMutation =
    trpc.notification.updateSubscription.useMutation();
  const markAllReadMutation = trpc.notification.markAllRead.useMutation();

  const [dishNotifs, setDishNotifs] = useState(false);
  const [eventNotifs, setEventNotifs] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [dialog, setDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({ open: false, title: "", message: "" });

  useEffect(() => {
    setDishNotifs(subscription?.isSubscribedFoodFavorites ?? false);
    setEventNotifs(subscription?.isSubscribedEvents ?? false);
  }, [subscription]);

  const hasMarkedReadRef = useRef(false);
  useEffect(() => {
    if (!userId || hasMarkedReadRef.current) return;
    hasMarkedReadRef.current = true;

    utils.notification.getSavedNotifications.setData({ userId }, (prev) =>
      prev?.map((n) => ({ ...n, isRead: true })),
    );

    markAllReadMutation.mutate(
      { userId },
      {
        onSettled: () => {
          void utils.notification.getSavedNotifications.invalidate({ userId });
        },
      },
    );
  }, [userId, utils, markAllReadMutation]);

  const showDialog = (title: string, message: string) =>
    setDialog({ open: true, title, message });

  const handleToggle = async (kind: ToggleKind, nextValue: boolean) => {
    if (!userId) {
      showDialog(
        "Sign In Required",
        "You must be logged in to manage notifications.",
      );
      return;
    }
    if (isBusy) return;

    const prevDish = dishNotifs;
    const prevEvent = eventNotifs;
    const revert = () => {
      setDishNotifs(prevDish);
      setEventNotifs(prevEvent);
    };

    if (kind === "food") setDishNotifs(nextValue);
    else setEventNotifs(nextValue);

    const nextDish = kind === "food" ? nextValue : prevDish;
    const nextEvent = kind === "event" ? nextValue : prevEvent;

    setIsBusy(true);
    try {
      if (nextValue) {
        if (!isPushSupported()) {
          showDialog(
            "Not Supported",
            "Push notifications are not supported in this browser.",
          );
          revert();
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          showDialog(
            "Permission Denied",
            "Reset notification permissions in your browser's address bar and try again.",
          );
          revert();
          return;
        }

        const subData = await ensurePushSubscription();
        await subscribeMutation.mutateAsync({
          userId,
          endpoint: subData.endpoint,
          p256dh: subData.p256dh,
          auth: subData.auth,
          isSubscribedFoodFavorites: nextDish,
          isSubscribedEvents: nextEvent,
        });
      } else {
        await updateSubscriptionMutation.mutateAsync({
          userId,
          isSubscribedFoodFavorites: nextDish,
          isSubscribedEvents: nextEvent,
        });
      }

      await utils.notification.getSubscription.invalidate({ userId });
    } catch (err) {
      console.error("Notification toggle failed:", err);
      showDialog("Something Went Wrong", "Action failed. Please try again.");
      revert();
    } finally {
      setIsBusy(false);
    }
  };

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

      {/* Toggles — drive push_subscriptions row + isSubscribedFoodFavorites / isSubscribedEvents */}
      <div className="px-5 pb-5 pt-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Dish Notifications
          </Typography>
          <Switch
            checked={dishNotifs}
            disabled={isBusy || subLoading || !userId}
            onChange={(e) => handleToggle("food", e.target.checked)}
            size="small"
          />
        </div>
        <div className="flex items-center justify-between">
          <Typography variant="body2" fontWeight={600} color="text.primary">
            Event Notifications
          </Typography>
          <Switch
            checked={eventNotifs}
            disabled={isBusy || subLoading || !userId}
            onChange={(e) => handleToggle("event", e.target.checked)}
            size="small"
          />
        </div>
      </div>

      <Dialog
        open={dialog.open}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              backgroundImage: "none",
              ".dark &": {
                backgroundColor: "#303035",
                backgroundImage: "none",
              },
            },
          },
        }}
      >
        <DialogTitle>
          <Typography fontWeight={600} color="primary">
            {dialog.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Typography color="text.primary">{dialog.message}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog((d) => ({ ...d, open: false }))}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
