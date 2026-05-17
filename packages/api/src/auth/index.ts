import { join } from "node:path";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import { config } from "dotenv";
import * as schema from "../../../db/src/index";
import { db } from "../../../db/src/index";

config({ path: join(process.cwd(), ".env") });

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

// BETTER_AUTH_SECRET must never carry the NEXT_PUBLIC_ prefix — Next.js inlines
// NEXT_PUBLIC_* variables into the client bundle at build time, which would
// expose the signing secret to every visitor. Use BETTER_AUTH_SECRET instead.
// NEXT_PUBLIC_BETTER_AUTH_SECRET is kept as a legacy alias for existing deploys.
const authSecret =
  process.env.BETTER_AUTH_SECRET ?? process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET;
if (!authSecret) throw new Error("BETTER_AUTH_SECRET is not set");

export const auth = betterAuth({
  debug: process.env.NODE_ENV !== "production",
  secret: authSecret,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.peterplate.com",
  // The iOS PWA shell (WKWebView) always sends Origin: https://www.peterplate.com
  // because Settings.swift hardcodes rootUrl to that domain.  Better Auth builds
  // its trusted-origins list from baseURL alone, so if NEXT_PUBLIC_BASE_URL is
  // unset or points to a different host (e.g. the Vercel deploy URL), the
  // origin check rejects every request that carries a cookie — which in the
  // WKWebView is every request, because Swift injects the app-platform cookie
  // via WKHTTPCookieStore.  Listing the production origin explicitly makes the
  // iOS auth flow immune to baseURL misconfiguration.
  trustedOrigins: [
    "https://www.peterplate.com",
    ...(process.env.NEXT_PUBLIC_BASE_URL ? [process.env.NEXT_PUBLIC_BASE_URL] : []),
  ],
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
      config: (() => {
        const clientId = process.env.AUTH_CLIENT_ID || "peterplate-dev";
        const discoveryUrl =
          "https://auth.icssc.club/.well-known/openid-configuration";
        const scopes = ["openid", "profile", "email"];
        const mapProfileToUser = (profile: Record<string, string>) => ({
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        });

        return [
          {
            providerId: "icssc",
            clientId,
            discoveryUrl,
            scopes,
            pkce: true,
            mapProfileToUser,
          },
          {
            providerId: "icssc-native",
            clientId,
            discoveryUrl,
            // Never fall back to localhost — if NEXT_PUBLIC_BASE_URL is unset the
            // redirect_uri would be http://localhost:3000/auth/native, which
            // (a) isn't registered with auth.icssc.club and
            // (b) causes Swift's ASWebAuthenticationSession.start() to silently
            //     return false because "localhost" doesn't match the Associated
            //     Domains entitlement (applinks:www.peterplate.com).
            redirectURI: `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.peterplate.com"}/auth/native`,
            scopes,
            pkce: true,
            mapProfileToUser,
          },
        ];
      })(),
    }),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
});
