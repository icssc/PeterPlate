"use client";

import { useCallback, useEffect, useState } from "react";
import { sendNotification, subscribeUser, unsubscribeUser } from "../actions";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [message, setMessage] = useState("");

  const registerServiceWorker = useCallback(async () => {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, [registerServiceWorker]);

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      console.error("VAPID public key is not configured");
      return;
    }
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold">Push Notifications</h3>
      {subscription ? (
        <div className="space-y-4">
          <p className="text-green-600">
            You are subscribed to push notifications.
          </p>
          <button
            type="button"
            onClick={unsubscribeFromPush}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Unsubscribe
          </button>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="button"
              onClick={sendTestNotification}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send Test
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p>You are not subscribed to push notifications.</p>
          <button
            type="button"
            onClick={subscribeToPush}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
}

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as Window & { MSStream?: unknown }).MSStream,
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-semibold">Install App</h3>
      <button
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add to Home Screen
      </button>
      {isIOS && (
        <p className="text-sm text-gray-600">
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
    </div>
  );
}

export default function PWATestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">PWA Test Page</h1>
        <p className="text-gray-600">
          Test Progressive Web App features including push notifications and
          installation.
        </p>
      </div>

      <div className="space-y-6">
        <PushNotificationManager />
        <InstallPrompt />
      </div>

      <div className="border-t pt-6 space-y-2">
        <h3 className="text-lg font-semibold">Setup Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>
            Install web-push globally:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              pnpm add -g web-push
            </code>
          </li>
          <li>
            Generate VAPID keys:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              web-push generate-vapid-keys
            </code>
          </li>
          <li>
            Add keys to your{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
                </code>
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  VAPID_PRIVATE_KEY=...
                </code>
              </li>
            </ul>
          </li>
          <li>
            Run locally with HTTPS:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              next dev --experimental-https
            </code>
          </li>
        </ol>
      </div>
    </div>
  );
}
