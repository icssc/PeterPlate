import "server-only";

import { db, account, session, users, verification } from "@peterplate/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";

const authSecret =
  process.env.BETTER_AUTH_SECRET ?? process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET;
if (!authSecret) throw new Error("BETTER_AUTH_SECRET is not set");

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  process.env.BETTER_AUTH_URL ??
  "https://peterplate.com";

export const auth = betterAuth({
  debug: process.env.NODE_ENV !== "production",
  secret: authSecret,
  baseURL,
  trustedOrigins: [baseURL],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      hasOnboarded: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "icssc",
          clientId: process.env.AUTH_CLIENT_ID || "peterplate-dev",
          discoveryUrl:
            "https://auth.icssc.club/.well-known/openid-configuration",
          scopes: ["openid", "profile", "email"],
          pkce: true,
          mapProfileToUser: (profile: Record<string, string>) => ({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          }),
        },
      ],
    }),
    nextCookies(),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session,
      account,
      verification,
    },
  }),
});
