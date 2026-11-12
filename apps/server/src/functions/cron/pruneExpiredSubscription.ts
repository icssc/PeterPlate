import type { Drizzle } from "@peterplate/db";
import { pushSubscriptions } from "@peterplate/db";
import { eq } from "drizzle-orm";
import { WebPushError } from "web-push";

import { logger } from "../../../logger";

/**
 * Handle a failed webpush.sendNotification.
 *
 * A 404 or 410 means that the user revoked the subscription in their browser, so the
 * row is deleted. Anything else is rethrown for the caller to report.
 */
export async function pruneExpiredSubscription(
  db: Drizzle,
  endpoint: string,
  error: unknown,
): Promise<void> {
  const isExpired =
    error instanceof WebPushError &&
    (error.statusCode === 404 || error.statusCode === 410);

  if (!isExpired) throw error;

  logger.info({ endpoint }, "Subscription expired, removing from DB...");
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));
}
