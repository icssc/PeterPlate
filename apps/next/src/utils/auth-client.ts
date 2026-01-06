//creates auth client that can be used for sign in functions
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8080",
});

export const {useSession, signIn, signOut} = authClient;