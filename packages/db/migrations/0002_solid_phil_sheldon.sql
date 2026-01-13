-- -- DROP TABLE "user";--> statement-breakpoint
-- CREATE TABLE IF NOT EXISTS "account" (
--   "id" text PRIMARY KEY NOT NULL
-- );
-- --> statement-breakpoint
-- CREATE TABLE IF NOT EXISTS "session" (
--   "id" text PRIMARY KEY NOT NULL,
--   "token" text NOT NULL UNIQUE
-- );
-- --> statement-breakpoint
-- CREATE TABLE IF NOT EXISTS "verification" (
--   "id" text PRIMARY KEY NOT NULL,
--   "identifier" text NOT NULL,
--   "value" text NOT NULL
-- );
-- ALTER TABLE "account" DROP CONSTRAINT "account_user_id_user_id_fk";
-- --> statement-breakpoint
-- ALTER TABLE "session" DROP CONSTRAINT "session_user_id_user_id_fk";
-- --> statement-breakpoint
-- DROP INDEX IF EXISTS "account_userId_idx";--> statement-breakpoint
-- DROP INDEX IF EXISTS "session_userId_idx";--> statement-breakpoint
-- DROP INDEX IF EXISTS "verification_identifier_idx";--> statement-breakpoint
-- ALTER TABLE "users" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
-- ALTER TABLE "users" ADD COLUMN "emailVerified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
-- ALTER TABLE "users" ADD COLUMN "image" text;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "accountId" text NOT NULL;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "providerId" text NOT NULL;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "accessToken" text;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "refreshToken" text;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "idToken" text;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "accessTokenExpiresAt" timestamp;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "refreshTokenExpiresAt" timestamp;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
-- ALTER TABLE "account" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
-- ALTER TABLE "session" ADD COLUMN "expiresAt" timestamp NOT NULL;--> statement-breakpoint
-- ALTER TABLE "session" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
-- ALTER TABLE "session" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
-- ALTER TABLE "session" ADD COLUMN "ipAddress" text;--> statement-breakpoint
-- ALTER TABLE "session" ADD COLUMN "userAgent" text;--> statement-breakpoint
-- ALTER TABLE "session" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
-- ALTER TABLE "verification" ADD COLUMN "expiresAt" timestamp NOT NULL;--> statement-breakpoint
-- ALTER TABLE "verification" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
-- ALTER TABLE "verification" ADD COLUMN "updatedAt" timestamp DEFAULT now();--> statement-breakpoint
-- DO $$ BEGIN
--  ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
-- EXCEPTION
--  WHEN duplicate_object THEN null;
-- END $$;
-- --> statement-breakpoint
-- DO $$ BEGIN
--  ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
-- EXCEPTION
--  WHEN duplicate_object THEN null;
-- END $$;
-- --> statement-breakpoint
-- ALTER TABLE "account" DROP COLUMN IF EXISTS "account_id";--> statement-breakpoint
-- ALTER TABLE "account" DROP COLUMN IF EXISTS "provider_id";--> statement-breakpoint
-- ALTER TABLE "account" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
-- ALTER TABLE "account" DROP COLUMN IF EXISTS "access_token";--> statement-breakpoint
-- ALTER TABLE "account" DROP COLUMN IF EXISTS "refresh_token";--> statement-breakpoint
-- ALTER TABLE "account" DROP COLUMN IF EXISTS "id_token";--> statement-breakpoint
-- ALTER TABLE "account" DROP COLUMN IF EXISTS "access_token_expires_at";--> statement-breakpoint
-- ALTER TABLE "account" DROP COLUMN IF EXISTS "refresh_token_expires_at";--> statement-breakpoint
-- ALTER TABLE "account" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
-- ALTER TABLE "account" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
-- ALTER TABLE "session" DROP COLUMN IF EXISTS "expires_at";--> statement-breakpoint
-- ALTER TABLE "session" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
-- ALTER TABLE "session" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
-- ALTER TABLE "session" DROP COLUMN IF EXISTS "ip_address";--> statement-breakpoint
-- ALTER TABLE "session" DROP COLUMN IF EXISTS "user_agent";--> statement-breakpoint
-- ALTER TABLE "session" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
-- ALTER TABLE "verification" DROP COLUMN IF EXISTS "expires_at";--> statement-breakpoint
-- ALTER TABLE "verification" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
-- ALTER TABLE "verification" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
-- ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");

-- DROP TABLE "user"; -- Already commented
--> statement-breakpoint
-- CREATE the Better Auth tables
CREATE TABLE "account" (
  "id" text PRIMARY KEY NOT NULL,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp,
  "refreshTokenExpiresAt" timestamp,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
  "id" text PRIMARY KEY NOT NULL,
  "token" text NOT NULL UNIQUE,
  "expiresAt" timestamp NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expiresAt" timestamp NOT NULL,
  "createdAt" timestamp DEFAULT now(),
  "updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
-- Add Better Auth columns to existing users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emailVerified" boolean DEFAULT false;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "image" text;
--> statement-breakpoint
-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
-- Make email NOT NULL and add unique constraint (after adding the column)
UPDATE "users" SET "email" = '' WHERE "email" IS NULL;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
--> statement-breakpoint
-- Make emailVerified NOT NULL
UPDATE "users" SET "emailVerified" = false WHERE "emailVerified" IS NULL;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "emailVerified" SET NOT NULL;