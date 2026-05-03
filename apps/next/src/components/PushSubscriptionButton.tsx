"use client";
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
      alert("You must be logged in to enable notifications.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSubscribed) {
        await unsubscribeMutation.mutateAsync({
          userId: session.user.id,
        });

        setIsSubscribed(false);
        alert("Notifications disabled.");
      } else {
        const permission = await requestNotificationPermission();
        if (permission !== "granted") {
          alert("Permission denied. Reset permissions in your address bar.");
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
        alert("Meal notifications enabled!");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Action failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSubscription}
      disabled={isLoading}
      type="button"
      title="Get notifications when your favorite meals are being served!"
      style={{
        padding: "10px 20px",
        backgroundColor: isSubscribed ? "#e53e3e" : "#0070f3",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: isLoading ? "default" : "pointer",
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isLoading
        ? "Processing..."
        : isSubscribed
          ? "Disable Notifications"
          : "Notify me about Favorites"}
    </button>
  );
}
