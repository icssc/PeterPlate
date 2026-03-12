/**
 * PWA Manager Component
 *
 * A component to manage PWA features and provide UI for users to enable notifications
 * This component can be added to your app layout or settings page
 */

"use client";

import { useEffect } from "react";
import {
  useOnlineStatus,
  usePushNotifications,
  usePWAFeatures,
  usePWAInstall,
  useServiceWorker,
} from "@/hooks/usePWA";

interface PWAManagerProps {
  /**
   * Whether to show install prompt automatically
   */
  autoShowInstallPrompt?: boolean;

  /**
   * Whether to log PWA status to console
   */
  debug?: boolean;
}

/**
 * PWA Manager Component
 *
 * This component initializes PWA features and manages service worker registration.
 * Add this component to your app layout to enable PWA functionality.
 *
 * @example
 * ```tsx
 * // In your layout or app component
 * <PWAManager debug={process.env.NODE_ENV === 'development'} />
 * ```
 */
export function PWAManager({ debug = false }: PWAManagerProps) {
  const { swState, isLoading: swLoading } = useServiceWorker();
  const { permission } = usePushNotifications();
  const { isInstallable, isInstalled } = usePWAInstall();
  const features = usePWAFeatures();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!debug) return;

    console.group("PWA Status");
    console.log("Service Worker:", {
      supported: swState?.isSupported,
      registered: swState?.isRegistered,
      loading: swLoading,
    });
    console.log("Push Notifications:", {
      permission,
      supported: features?.pushNotifications,
    });
    console.log("Installation:", {
      installable: isInstallable,
      installed: isInstalled,
    });
    console.log("Online Status:", isOnline);
    console.log("PWA Features:", features);
    console.groupEnd();
  }, [
    swState,
    swLoading,
    permission,
    isInstallable,
    isInstalled,
    isOnline,
    features,
    debug,
  ]);

  // This component doesn't render anything
  // It just manages PWA features in the background
  return null;
}

/**
 * Example component for PWA settings/info
 * You can use this in your settings page or as a banner
 */
export function PWAStatus() {
  const { swState } = useServiceWorker();
  const { permission, requestPermission, isLoading } = usePushNotifications();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const isOnline = useOnlineStatus();

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-semibold">PWA Status</h3>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Online Status:</span>
          <span className={isOnline ? "text-green-600" : "text-red-600"}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Service Worker:</span>
          <span
            className={
              swState?.isRegistered ? "text-green-600" : "text-gray-600"
            }
          >
            {swState?.isRegistered ? "Active" : "Not Registered"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Installation:</span>
          <span>
            {isInstalled ? (
              <span className="text-green-600">Installed</span>
            ) : isInstallable ? (
              <button
                type="button"
                onClick={promptInstall}
                className="text-blue-600 hover:underline"
              >
                Install App
              </button>
            ) : (
              <span className="text-gray-600">Not Available</span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Push Notifications:</span>
          <span>
            {permission === "granted" ? (
              <span className="text-green-600">Enabled</span>
            ) : permission === "denied" ? (
              <span className="text-red-600">Blocked</span>
            ) : (
              <button
                type="button"
                onClick={requestPermission}
                disabled={isLoading}
                className="text-blue-600 hover:underline disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Enable"}
              </button>
            )}
          </span>
        </div>
      </div>

      {permission !== "granted" && permission !== "denied" && (
        <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          <p>
            Enable push notifications to receive updates about new menus,
            special events, and your favorite dishes!
          </p>
        </div>
      )}

      {!isInstalled && !isInstallable && (
        <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm text-gray-600">
          <p>
            This app is already installed or install prompt is not available.
            You can still use all PWA features!
          </p>
        </div>
      )}
    </div>
  );
}
