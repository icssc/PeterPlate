"use server";

import webpush from "web-push";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    // TODO: THIS IS A PLACEHOLDER PUT THE REAL EMAIL HERE
    "mailto:your-email@example.com",
    vapidPublicKey,
    vapidPrivateKey,
  );
}

let subscription: PushSubscription | null = null;

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub;
  // We want to store the subscription in a database later on
  // This is intentionally very simple

  // return { success: true }
}

export async function unsubscribeUser() {
  subscription = null;
  // We want to delete the subscription from the database later on
  // This is intentionally very simple

  // return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error("No subscription available");
  }

  try {
    await webpush.sendNotification(
      subscription as unknown as webpush.PushSubscription,
      JSON.stringify({
        title: "Test Notification",
        body: message,
        icon: "/icons/icon-192x192.png",
      }),
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return {
      success: false,
      error: "Failed to send notification",
    };
  }
}
