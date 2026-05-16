import { join } from "node:path";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import { config } from "dotenv";
import * as schema from "../../../db/src/index";
import { db } from "../../../db/src/index";

config({ path: join(process.cwd(), ".env") });

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export const auth = betterAuth({
  debug: true,
  secret: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
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
        const discoveryUrl = "https://auth.icssc.club/.well-known/openid-configuration";
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
            redirectURI: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/auth/native`,
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
