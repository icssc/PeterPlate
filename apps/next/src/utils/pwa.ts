// Service Worker and Push Notification Utilities
// Helper functions for managing PWA features and push notifications.

import type {
  BeforeInstallPromptEvent,
  PushPermission,
  PushPermissionOptions,
  PushSubscriptionJSON,
  PWAFeatures,
  PWAInstallPromptOptions,
  ServiceWorkerState,
} from "@/types/service-worker";

/**
 * Register the service worker
 * @returns Promise<ServiceWorkerRegistration | null>
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Workers are not supported in this browser");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    console.log("Service Worker registered successfully:", registration);

    // Check for updates periodically
    setInterval(
      () => {
        registration.update();
      },
      1000 * 60 * 60,
    ); // Check every hour

    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);

    return null;
  }
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const result = await registration.unregister();
      console.log("Service Worker unregistered:", result);
      return result;
    }

    return false;
  } catch (error) {
    console.error("Service Worker unregistration failed:", error);
    return false;
  }
}

/**
 * Get the current service worker state
 */
export async function getServiceWorkerState(): Promise<ServiceWorkerState> {
  const state: ServiceWorkerState = {
    isSupported: "serviceWorker" in navigator,
    isRegistered: false,
    registration: null,
    pushSubscription: null,
    pushPermission: "default",
  };

  if (!state.isSupported) {
    return state;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    state.registration = registration || null;
    state.isRegistered = !!state.registration;

    if (state.registration?.pushManager) {
      state.pushSubscription =
        await state.registration.pushManager.getSubscription();
      state.pushPermission = await navigator.permissions
        .query({ name: "notifications" as PermissionName })
        .then((result) => result.state as PushPermission)
        .catch(() => Notification.permission as PushPermission);
    }
  } catch (error) {
    console.error("Error getting service worker state:", error);
  }

  return state;
}

/**
 * Request permission for push notifications
 * @param options - Options for handling the permission request
 * @returns Promise<PushPermission>
 */
export async function requestPushPermission(
  options?: PushPermissionOptions,
): Promise<PushPermission> {
  if (!("Notification" in window)) {
    console.warn("Notifications are not supported in this browser");
    return "denied";
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted" && options?.onGranted) {
      options.onGranted();
    } else if (permission === "denied" && options?.onDenied) {
      options.onDenied();
    }

    return permission as PushPermission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return "denied";
  }
}

/**
 * Check if push notifications are supported and enabled
 */
export function isPushNotificationSupported(): boolean {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/**
 * Get current push notification permission status
 */
export function getPushPermission(): PushPermission {
  if (!("Notification" in window)) {
    return "denied";
  }

  return Notification.permission as PushPermission;
}

/**
 * Subscribe to push notifications
 * NOTE: This is groundwork - actual implementation requires backend setup
 * IS NOT IMPLEMENTED YET
 *
 * @param applicationServerKey - VAPID public key from the server
 * @returns Promise<PushSubscription | null>
 */
export async function subscribeToPushNotifications(
  _applicationServerKey?: string,
): Promise<PushSubscription | null> {
  console.log("Push notification subscription - Not yet implemented");
  console.log("TODO: Implement with VAPID keys from backend");

  return null;
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  console.log("Push notification unsubscription - Not yet implemented");
  console.log("TODO: Implement with backend integration");

  return false;
}

/**
 * Get the current push subscription
 */
export async function getPushSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration?.pushManager) {
      return null;
    }

    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error("Error getting push subscription:", error);
    return null;
  }
}

/**
 * Convert push subscription to JSON
 */
export function subscriptionToJSON(
  subscription: PushSubscription,
): PushSubscriptionJSON | null {
  try {
    const json = subscription.toJSON();
    if (!json.keys?.p256dh || !json.keys?.auth) {
      return null;
    }

    return {
      endpoint: json.endpoint || "",
      expirationTime: json.expirationTime || null,
      keys: {
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      },
    };
  } catch (error) {
    console.error("Error converting subscription to JSON:", error);
    return null;
  }
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Setup PWA install prompt listener
 */
export function setupInstallPrompt(): void {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    console.log("PWA install prompt ready");
  });
}

/**
 * Show PWA install prompt
 */
export async function showInstallPrompt(
  options?: PWAInstallPromptOptions,
): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn("Install prompt not available");
    return false;
  }

  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User ${outcome} the install prompt`);

    if (outcome === "accepted" && options?.onAccepted) {
      options.onAccepted();
    } else if (outcome === "dismissed" && options?.onDismissed) {
      options.onDismissed();
    }

    deferredPrompt = null;
    return outcome === "accepted";
  } catch (error) {
    console.error("Error showing install prompt:", error);
    return false;
  }
}

/**
 * Check if install prompt is available
 */
export function isInstallPromptAvailable(): boolean {
  return deferredPrompt !== null;
}

/**
 * Check which PWA features are supported
 */
export function detectPWAFeatures(): PWAFeatures {
  return {
    serviceWorker: "serviceWorker" in navigator,

    pushNotifications:
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window,

    backgroundSync:
      "serviceWorker" in navigator &&
      "sync" in ServiceWorkerRegistration.prototype,

    periodicBackgroundSync:
      "serviceWorker" in navigator &&
      "periodicSync" in ServiceWorkerRegistration.prototype,

    notifications: "Notification" in window,
  };
}
