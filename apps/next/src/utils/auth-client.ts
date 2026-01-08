//creates auth client that can be used for sign in functions
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export const {useSession, signIn, signOut} = authClient;