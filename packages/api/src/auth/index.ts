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

// SST sets NEXT_PUBLIC_BASE_URL (see sst.config.ts, mirroring AntAlmanac).
// BETTER_AUTH_URL is kept as a server-side alias for the same value.
const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  process.env.BETTER_AUTH_URL ??
  "https://peterplate.com";

export const auth = betterAuth({
  debug: process.env.NODE_ENV !== "production",
  secret: authSecret,
  baseURL,
  // The iOS PWA shell (WKWebView) sends Origin from Settings.swift rootUrl.
  // auth.icssc.club only allows redirect URIs on the apex domain (peterplate.com),
  // not www — baseURL and trustedOrigins must match deploy + iOS + IdP registration.
  trustedOrigins: [baseURL],
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
            // Never fall back to localhost — unset baseURL would produce an unregistered
            // redirect_uri and ASWebAuthenticationSession.start() would return false
            // because localhost doesn't match the Associated Domains entitlement.
            redirectURI: `${baseURL}/auth/native`,
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
