import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../../db/src/index"
import * as schema from "../../../db/src/index";

import { config } from "dotenv";
import { join } from "path";

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
          clientId: "peterplate-dev",
          discoveryUrl: "https://auth.icssc.club/.well-known/openid-configuration",
          scopes: ["openid", "profile", "email"],
          pkce: true,
          mapProfileToUser: (profile) => {
            console.log("Profile:", profile);
            return {
              name: profile.name,
              email: profile.email,
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
  })
});
