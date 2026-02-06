import type {
  ExpoPushErrorReceipt,
  ExpoPushMessage,
  ExpoPushSuccessTicket,
  ExpoPushTicket,
  ExpoPushToken,
} from "expo-server-sdk";
import { Expo } from "expo-server-sdk";

import type { Drizzle } from "@peterplate/db";
import { pushTokens } from "@peterplate/db";

// Send Notification to all users which set up a notification id
export interface Notification {
  title?: string;
  subtitle?: string;
  body?: string;
  data?: object;
}

export async function getPushTokens(
  db: Drizzle,
): Promise<ExpoPushToken[] | null> {
  const fetchedPushTokens = await db.select().from(pushTokens);
  return fetchedPushTokens.map((pushToken) => pushToken.token);
}

export async function broadcastNotification(
  db: Drizzle,
  expo: Expo,
  notification: Notification,
): Promise<ExpoPushTicket[] | null> {
  const pushTokens = await getPushTokens(db);
  if (!pushTokens) {
    return null;
  }
  const messages: ExpoPushMessage[] = [];
  for (const pushToken of pushTokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(
        `Push token ${pushToken as string} is not a valid Expo push token`,
      );
      continue;
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)

    const message: ExpoPushMessage = {
      ...notification,
      to: pushToken,
      sound: "default",
    };
    messages.push(message);
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];
  await (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);

        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();

  return tickets;
}

export function handlePushTickets(tickets: ExpoPushTicket[]) {
  // handle ticket errors
  for (const ticket of tickets) {
    if (ticket.status === "error" && ticket.details?.error) {
      console.error(ticket.details);
    } else {
      // save the ticket ids in some temporary location or in the database
    }
  }
}

export async function handleNotificationReceipts(
  expo: Expo,
  tickets: ExpoPushSuccessTicket[],
) {
  const receiptIds: string[] = [];
  for (const ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  await (async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (const chunk of receiptIdChunks) {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (const receiptId in receipts) {
          const { status, details } = receipts[receiptId]!;
          if (status === "ok") continue;
          else if (status === "error") {
            const { message } = receipts[receiptId] as ExpoPushErrorReceipt;
            console.error(
              `There was an error sending a notification: ${message}`,
            );
            if (details?.error) {
              // The error codes are listed in the Expo documentation:
              // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
              // You must handle the errors appropriately.
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
}
