CREATE TYPE "public"."allergy" AS ENUM('eggs', 'fish', 'milk', 'peanuts', 'sesame', 'shellfish', 'soy', 'treeNuts', 'wheat');--> statement-breakpoint
CREATE TYPE "public"."preference" AS ENUM('glutenFree', 'halal', 'kosher', 'locallyGrown', 'organic', 'vegan', 'vegetarian');--> statement-breakpoint
UPDATE "user_allergies" SET "allergy" = 'treeNuts' WHERE "allergy" = 'Tree Nuts';--> statement-breakpoint
UPDATE "user_allergies" SET "allergy" = 'eggs' WHERE "allergy" = 'Eggs';--> statement-breakpoint
UPDATE "user_allergies" SET "allergy" = 'fish' WHERE "allergy" = 'Fish';--> statement-breakpoint
UPDATE "user_allergies" SET "allergy" = 'milk' WHERE "allergy" = 'Milk';--> statement-breakpoint
UPDATE "user_allergies" SET "allergy" = 'peanuts' WHERE "allergy" = 'Peanuts';--> statement-breakpoint
UPDATE "user_allergies" SET "allergy" = 'sesame' WHERE "allergy" = 'Sesame';--> statement-breakpoint
UPDATE "user_allergies" SET "allergy" = 'shellfish' WHERE "allergy" = 'Shellfish';--> statement-breakpoint
UPDATE "user_allergies" SET "allergy" = 'soy' WHERE "allergy" = 'Soy';--> statement-breakpoint
UPDATE "user_allergies" SET "allergy" = 'wheat' WHERE "allergy" = 'Wheat';--> statement-breakpoint
UPDATE "user_dietary_preferences" SET "preference" = 'glutenFree' WHERE "preference" = 'Gluten Free';--> statement-breakpoint
UPDATE "user_dietary_preferences" SET "preference" = 'halal' WHERE "preference" = 'Halal';--> statement-breakpoint
UPDATE "user_dietary_preferences" SET "preference" = 'kosher' WHERE "preference" = 'Kosher';--> statement-breakpoint
UPDATE "user_dietary_preferences" SET "preference" = 'locallyGrown' WHERE "preference" = 'Locally Grown';--> statement-breakpoint
UPDATE "user_dietary_preferences" SET "preference" = 'organic' WHERE "preference" = 'Organic';--> statement-breakpoint
UPDATE "user_dietary_preferences" SET "preference" = 'vegan' WHERE "preference" = 'Vegan';--> statement-breakpoint
UPDATE "user_dietary_preferences" SET "preference" = 'vegetarian' WHERE "preference" = 'Vegetarian';--> statement-breakpoint
ALTER TABLE "user_allergies" ALTER COLUMN "allergy" SET DATA TYPE "public"."allergy" USING "allergy"::"public"."allergy";--> statement-breakpoint
ALTER TABLE "user_dietary_preferences" ALTER COLUMN "preference" SET DATA TYPE "public"."preference" USING "preference"::"public"."preference";