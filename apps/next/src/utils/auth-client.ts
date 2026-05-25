import { getSignOutUrl } from "@/lib/auth-actions";
import type { auth } from "@/lib/auth";
import {
  genericOAuthClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [genericOAuthClient(), inferAdditionalFields<typeof auth>()],
});

export const { useSession } = authClient;

export async function signOut() {
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

  if (logoutUrl) {
    window.location.href = logoutUrl;
  } else {
    window.location.reload();
  }
}
