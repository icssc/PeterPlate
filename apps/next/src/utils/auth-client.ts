import {
  genericOAuthClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { getSignOutUrl } from "@/lib/auth-actions";

export const authClient = createAuthClient({
  plugins: [
    genericOAuthClient(),
    inferAdditionalFields({
      user: {
        hasOnboarded: {
          type: "boolean" as const,
          required: false,
          defaultValue: false,
        },
      },
    }),
  ],
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
