// TypeScript types for Service Worker and Push Notifications
// These types provide full type safety for working with service workers
// and push notifications in the PeterPlate PWA.

export interface ServiceWorkerMessage {
  type: string;
  [key: string]: any;
}

export interface SkipWaitingMessage extends ServiceWorkerMessage {
  type: "SKIP_WAITING";
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: NotificationData;
  actions?: NotificationAction[];
}

export interface NotificationData {
  url?: string;
  dishId?: string;
  eventId?: string;
  menuId?: string;
  restaurantId?: string;
  type?: NotificationType;
  timestamp?: number;
  [key: string]: any;
}

export type NotificationType =
  | "new-menu"
  | "favorite-dish"
  | "special-event"
  | "rating-reminder"
  | "general";

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface PushSubscriptionJSON {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface SubscriptionOptions {
  userVisibleOnly: boolean;
  applicationServerKey: Uint8Array | string;
}

export interface ServiceWorkerRegistrationOptions {
  scope?: string;
  updateViaCache?: "all" | "imports" | "none";
}

export type PushPermission = "default" | "granted" | "denied";

export interface PushPermissionOptions {
  prompt?: boolean;
  onGranted?: () => void;
  onDenied?: () => void;
}

export interface ExtendedNotificationOptions extends NotificationOptions {
  data?: NotificationData;
  actions?: NotificationAction[];
  badge?: string;
  icon?: string;
  image?: string;
  renotify?: boolean;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  timestamp?: number;
  vibrate?: number[];
}

export interface PushManager {
  subscribe(options?: SubscriptionOptions): Promise<PushSubscription>;
  getSubscription(): Promise<PushSubscription | null>;
  permissionState(options?: SubscriptionOptions): Promise<PushPermission>;
}

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export interface PWAInstallPromptOptions {
  onAccepted?: () => void;
  onDismissed?: () => void;
}

export type CacheStrategy =
  | "cache-first"
  | "network-first"
  | "cache-only"
  | "network-only"
  | "stale-while-revalidate";

export interface CacheOptions {
  cacheName: string;
  strategy: CacheStrategy;
  maxAge?: number;
  maxItems?: number;
}

export interface BackgroundSyncOptions {
  tag: string;
}

export type SyncTag =
  | "sync-favorites"
  | "sync-ratings"
  | "sync-preferences"
  | "sync-offline-actions";

export interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  registration: ServiceWorkerRegistration | null;
  pushSubscription: PushSubscription | null;
  pushPermission: PushPermission;
}

export interface PWAFeatures {
  serviceWorker: boolean;
  pushNotifications: boolean;
  backgroundSync: boolean;
  periodicBackgroundSync: boolean;
  notifications: boolean;
}
