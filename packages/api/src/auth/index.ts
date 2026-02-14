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
          mapProfileToUser: (profile) => {
            return {
              name: profile.name,
              email: profile.email,
              image: profile.picture,
            };
          },
        },
      ],
    }),
  ],
  // socialProviders: {
  //   google: {
  //     clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
  //   },
  // },
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
