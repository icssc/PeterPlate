import {
  genericOAuthClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import posthog from "posthog-js";
import { useUserStore } from "@/context/useUserStore";
import type { auth } from "@/lib/auth";
import { getSignOutUrl } from "@/lib/auth-actions";

export const authClient = createAuthClient({
  plugins: [genericOAuthClient(), inferAdditionalFields<typeof auth>()],
});

export const { useSession } = authClient;

interface SignOutOptions {
  /** Runs after local/session cleanup, immediately before IdP redirect. */
  onBeforeRedirect?: () => void;
}

export async function signOut({ onBeforeRedirect }: SignOutOptions = {}) {
  let logoutUrl: string | null = null;
  try {
    logoutUrl = await getSignOutUrl(window.location.origin);
  } catch (error) {
    console.error("Error getting logout URL", error);
  }

  const { error } = await authClient.signOut();
  if (error) {
    console.error("Error during logout", error);
  }

  useUserStore.getState().clearUser();
  posthog.reset();
  onBeforeRedirect?.();

  // IdP logout clears auth.icssc.club session and redirects back to PeterPlate.
  // Do not navigate anywhere else after this — callers must not override it.
  if (logoutUrl) {
    window.location.assign(logoutUrl);
    return;
  }

  window.location.reload();
}
