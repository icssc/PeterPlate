import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

declare module "better-auth" {}

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [genericOAuthClient()],
});

export const { useSession, signIn, signOut } = authClient;
