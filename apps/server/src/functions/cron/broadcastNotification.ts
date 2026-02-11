import { Expo } from "expo-server-sdk";

import { broadcastNotification, Notification } from "@peterplate/api";
import {
  createDrizzle,
  EventSchema,
  getRestaurantNameById,
  pool,
} from "@peterplate/db";

export const main = async (evt, _context) => {
  const db = createDrizzle({
    connectionString: process.env.DATABASE_URL,
  });

  const event = EventSchema.parse(evt.body);
  console.log("Broadcasting event notification");

  const expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN,
  });

  // We should format the event subtitle to be something like "Brandywine is holding a special event"
  // Title: Special Event at {restaurant_name}
  // Subtitle: event.shortDescription
  // TODO: Maybe put an image in the notification, but I don't think it's in the normal expo notification api
  // Image: event.image

  const notification = {
    title: `Special event at ${getRestaurantNameById(event.restaurantId)} 🎉`,
    subtitle: `Title: ${event.shortDescription}`,
    body: `Description: ${event.shortDescription}`,
  } satisfies Notification;

  const _tickets = broadcastNotification(db, expo, notification);

  await pool({ connectionString: process.env.DATABASE_URL }).end();
};
