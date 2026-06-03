import { join } from "node:path";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
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

// SST sets NEXT_PUBLIC_BASE_URL (see sst.config.ts, mirroring AntAlmanac).
// BETTER_AUTH_URL is kept as a server-side alias for the same value.
const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  process.env.BETTER_AUTH_URL ??
  "https://peterplate.com";

const AUTH_PROVIDER_ID = "icssc";

export const auth = betterAuth({
  secret: authSecret,
  baseURL,
  // The iOS PWA shell (WKWebView) sends Origin from Settings.swift rootUrl.
  // auth.icssc.club only allows redirect URIs on the apex domain (peterplate.com),
  // not www — baseURL and trustedOrigins must match deploy + iOS + IdP registration.
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
      config: (() => {
        const clientId = process.env.AUTH_CLIENT_ID || "peterplate-dev";
        const discoveryUrl =
          "https://auth.icssc.club/.well-known/openid-configuration";
        const scopes = ["openid", "profile", "email"];
        const mapProfileToUser = (profile: Record<string, string>) => {
          const email = profile.email;
          const name = profile.name ?? email?.split("@")[0] ?? "User";
          return {
            ...profile,
            name,
            email,
            image: profile.picture ?? profile.image,
          };
        };

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
            redirectURI: `${baseURL ?? "https://www.peterplate.com"}/auth/native`,
            scopes,
            pkce: true,
            mapProfileToUser,
          },
        ];
      })(),
    }),
    // Required for Set-Cookie on OAuth callbacks in Next.js App Router (see AntAlmanac).
    nextCookies(),
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
