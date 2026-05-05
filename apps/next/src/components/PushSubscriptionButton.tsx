"use client";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSession } from "@/utils/auth-client";
import { trpc } from "@/utils/trpc";

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

async function requestNotificationPermission(): Promise<NotificationPermission> {
  return await Notification.requestPermission();
}

async function subscribeToPushManager(
  vapidPublicKey: string,
): Promise<PushSubscription> {
  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
  });
}

export default function PushSubscriptionButton() {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dialog, setDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({
    open: false,
    title: "",
    message: "",
  });

  const showDialog = (title: string, message: string) => {
    setDialog({ open: true, title, message });
  };

  const subscribeMutation = trpc.notification.subscribe.useMutation();
  const unsubscribeMutation = trpc.notification.unsubscribe.useMutation();

  const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;
  const utils = trpc.useUtils();

  useEffect(() => {
    const checkSubscription = async () => {
      if (
        isPushSupported() &&
        Notification.permission === "granted" &&
        session?.user?.id
      ) {
        try {
          const subscription = await utils.notification.getSubscription.fetch({
            userId: session.user.id,
          });
          setIsSubscribed(!!subscription);
        } catch (error) {
          console.error("Failed to fetch subscription:", error);
          setIsSubscribed(false);
        }
      }
    };

    checkSubscription();
  }, [session?.user?.id, utils]);

  const handleToggleSubscription = async () => {
    if (!session?.user?.id) {
      showDialog(
        "Sign In Required",
        "You must be logged in to enable notifications.",
      );
      return;
    }

    setIsLoading(true);

    try {
      if (isSubscribed) {
        await unsubscribeMutation.mutateAsync({
          userId: session.user.id,
        });

        setIsSubscribed(false);
        showDialog(
          "Notifications Disabled",
          "You will no longer receive notifications for your favorite meals.",
        );
      } else {
        const permission = await requestNotificationPermission();
        if (permission !== "granted") {
          showDialog(
            "Permission Denied",
            "Reset notification permissions in your browser's address bar and try again.",
          );
          return;
        }

        const subscription = await subscribeToPushManager(VAPID_PUBLIC_KEY);
        const subJSON = subscription.toJSON();

        if (!subJSON.endpoint || !subJSON.keys?.p256dh || !subJSON.keys?.auth) {
          throw new Error("Invalid subscription keys generated.");
        }

        await subscribeMutation.mutateAsync({
          userId: session.user.id,
          endpoint: subJSON.endpoint,
          p256dh: subJSON.keys.p256dh,
          auth: subJSON.keys.auth,
        });

        setIsSubscribed(true);
        showDialog(
          "Notifications Enabled",
          "You'll be notified at 9am when your favorite meals are being served!",
        );
      }
    } catch (err) {
      console.error("Subscription error:", err);
      showDialog("Something Went Wrong", "Action failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tooltip
        title={
          isSubscribed
            ? "Disable meal notifications"
            : "Get notified about your favorite meals"
        }
      >
        <span>
          <IconButton
            onClick={handleToggleSubscription}
            disabled={isLoading}
            color={isSubscribed ? "error" : "primary"}
            size="large"
          >
            {isSubscribed ? <NotificationsOffIcon /> : <NotificationsIcon />}
          </IconButton>
        </span>
      </Tooltip>

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
          <DialogContentText>
            <Typography color="text.primary">{dialog.message}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog((d) => ({ ...d, open: false }))}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
