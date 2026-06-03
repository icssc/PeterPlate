import "server-only";

import { account, db, session, users, verification } from "@peterplate/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, getOAuthState } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";

import { AUTH_PROVIDER_ID } from "@/lib/auth-constants";
import type { AuthAdditionalData } from "@/lib/auth-types";
import { getSafeAuthRedirectPath } from "@/lib/auth-utils";

const authSecret =
  process.env.BETTER_AUTH_SECRET ?? process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET;
if (!authSecret) throw new Error("BETTER_AUTH_SECRET is not set");

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  process.env.BETTER_AUTH_URL ??
  "https://peterplate.com";

const OIDC_ISSUER_URL = "https://auth.icssc.club";

export const auth = betterAuth({
  appName: "PeterPlate",
  secret: authSecret,
  baseURL,
  trustedOrigins: [baseURL],
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: [AUTH_PROVIDER_ID],
    },
  },
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
          providerId: AUTH_PROVIDER_ID,
          issuer: OIDC_ISSUER_URL,
          discoveryUrl: `${OIDC_ISSUER_URL}/.well-known/openid-configuration`,
          clientId: process.env.AUTH_CLIENT_ID || "peterplate-dev",
          scopes: ["openid", "profile", "email"],
          pkce: true,
          mapProfileToUser: (profile) => {
            const email = profile.email;
            const name = profile.name ?? email?.split("@")[0] ?? "User";
            return {
              ...profile,
              name,
              email,
              image: profile.picture ?? profile.image,
            };
          },
        },
      ],
    }),
    nextCookies(),
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/oauth2/callback/:providerId") {
        const additionalData =
          (await getOAuthState()) as AuthAdditionalData | null;
        if (additionalData) {
          if (additionalData.returnUrl) {
            const returnUrl = getSafeAuthRedirectPath(
              additionalData.returnUrl,
              ctx.request?.url,
              new URL(baseURL).origin,
            );
            ctx.redirect(returnUrl);
          }
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

export type AuthorizationUrlParams = Record<string, string>;
