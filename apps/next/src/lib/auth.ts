import "server-only";

import { db, account, session, users, verification } from "@peterplate/db";
import { createAuthMiddleware, getOAuthState } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";

import { getSafeAuthRedirectPath } from "@/lib/auth-utils";
import type { AuthAdditionalData } from "@/lib/auth-types";

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
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/oauth2/callback/:providerId") {
        const additionalData = (await getOAuthState()) as
          | AuthAdditionalData
          | null;
        if (additionalData?.returnUrl) {
          const returnUrl = getSafeAuthRedirectPath(
            additionalData.returnUrl,
            ctx.request?.url,
            new URL(baseURL).origin,
          );
          ctx.redirect(returnUrl);
        }
      }
    }),
  },
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
