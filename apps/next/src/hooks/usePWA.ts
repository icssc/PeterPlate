// React hooks for PWA functionality
// Custom hooks to integrate PWA features into React

"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  PushPermission,
  PWAFeatures,
  ServiceWorkerState,
} from "@/types/service-worker";
import {
  detectPWAFeatures,
  getPushPermission,
  getServiceWorkerState,
  isInstallPromptAvailable,
  registerServiceWorker,
  requestPushPermission,
  setupInstallPrompt,
  showInstallPrompt,
} from "@/utils/pwa";

/**
 * Hook to control and manage service worker registration and state
 */
export function useServiceWorker() {
  const [swState, setSwState] = useState<ServiceWorkerState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initServiceWorker() {
      try {
        setIsLoading(true);
        await registerServiceWorker();
        const state = await getServiceWorkerState();
        setSwState(state);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    }

    initServiceWorker();
  }, []);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const state = await getServiceWorkerState();
      setSwState(state);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { swState, isLoading, error, refresh };
}

/**
 * Hook to manage push notification permissions and subscription
 */
export function usePushNotifications() {
  const [permission, setPermission] = useState<PushPermission>("default");
  const [isSubscribed, _setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPermission(getPushPermission());
  }, []);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await requestPushPermission({
        onGranted: () => {
          console.log("Push notifications granted");
        },
        onDenied: () => {
          console.log("Push notifications denied");
        },
      });

      setPermission(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // TODO: Implement subscribe/unsubscribe when the backend is ready
  const subscribe = useCallback(async () => {
    console.log("Subscribe - Not yet implemented");
    console.log("TODO: Implement with backend integration");

    // Will be implemented later with backend
    return false;
  }, []);

  const unsubscribe = useCallback(async () => {
    console.log("Unsubscribe - Not yet implemented");
    console.log("TODO: Implement with backend integration");

    // Will be implemented later with backend
    // return false;
  }, []);

  return {
    permission,
    isSubscribed,
    isLoading,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}

/**
 * Hook to manage PWA installation prompt
 */
export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setupInstallPrompt();

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = () => {
      setIsInstallable(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!isInstallPromptAvailable()) {
      console.warn("Install prompt not available");
      return false;
    }

    return await showInstallPrompt({
      onAccepted: () => {
        console.log("PWA installation accepted");
      },
      onDismissed: () => {
        console.log("PWA installation dismissed");
      },
    });
  }, []);

  return {
    isInstallable,
    isInstalled,
    promptInstall,
  };
}

/**
 * Hook to detect available PWA features
 */
export function usePWAFeatures() {
  const [features, setFeatures] = useState<PWAFeatures | null>(null);

  useEffect(() => {
    setFeatures(detectPWAFeatures());
  }, []);

  return features;
}

/**
 * Hook to track online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
