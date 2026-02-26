import type { auth } from "@api/auth";
import {
  genericOAuthClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [genericOAuthClient(), inferAdditionalFields<typeof auth>()],
});

export const { useSession, signIn, signOut } = authClient;
