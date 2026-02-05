-- Custom SQL migration file, put you code below! --
ALTER TABLE "logged_meals" ADD COLUMN "id" uuid;

UPDATE "logged_meals" SET "id" = gen_random_uuid() WHERE "id" IS NULL;

ALTER TABLE "logged_meals" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "logged_meals" ALTER COLUMN "id" SET NOT NULL;

ALTER TABLE "logged_meals" DROP CONSTRAINT IF EXISTS "logged_meals_user_id_dish_id_pk";

ALTER TABLE "logged_meals" ADD CONSTRAINT "logged_meals_pkey" PRIMARY KEY ("id");

CREATE INDEX IF NOT EXISTS "logged_meals_user_id_idx" ON "logged_meals" ("user_id");

CREATE INDEX IF NOT EXISTS "logged_meals_dish_id_idx" ON "logged_meals" ("dish_id");

CREATE INDEX IF NOT EXISTS "logged_meals_logged_at_idx" ON "logged_meals" ("eaten_at");