CREATE TYPE "public"."allergy" AS ENUM('eggs', 'fish', 'milk', 'peanuts', 'sesame', 'shellfish', 'soy', 'treeNuts', 'wheat');--> statement-breakpoint
CREATE TYPE "public"."preference" AS ENUM('glutenFree', 'halal', 'kosher', 'locallyGrown', 'organic', 'vegan', 'vegetarian');--> statement-breakpoint
ALTER TABLE "user_allergies" ALTER COLUMN "allergy" SET DATA TYPE "public"."allergy" USING "allergy"::"public"."allergy";--> statement-breakpoint
ALTER TABLE "user_dietary_preferences" ALTER COLUMN "preference" SET DATA TYPE "public"."preference" USING "preference"::"public"."preference";