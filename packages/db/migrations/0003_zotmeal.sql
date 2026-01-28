ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_restaurant_id_restaurants_id_fk";--> statement-breakpoint
ALTER TABLE "menus" DROP CONSTRAINT IF EXISTS "menus_restaurant_id_restaurants_id_fk";--> statement-breakpoint
ALTER TABLE "menus" DROP CONSTRAINT IF EXISTS "menus_period_id_date_restaurant_id_periods_id_date_restaurant_id_fk";--> statement-breakpoint
ALTER TABLE "periods" DROP CONSTRAINT IF EXISTS "periods_restaurant_id_restaurants_id_fk";--> statement-breakpoint
ALTER TABLE "stations" DROP CONSTRAINT IF EXISTS "stations_restaurant_id_restaurants_id_fk";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "restaurant_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "menus" ALTER COLUMN "restaurant_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "periods" ALTER COLUMN "restaurant_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "stations" ALTER COLUMN "restaurant_id" SET DATA TYPE text;--> statement-breakpoint
UPDATE "restaurants"
SET "id" = CASE
  WHEN "id" = '3056' THEN 'anteatery'
  WHEN "id" = '3314' THEN 'brandywine'
  ELSE "id"
END;--> statement-breakpoint
UPDATE "menus"
SET "restaurant_id" = CASE
  WHEN "restaurant_id" = '3056' THEN 'anteatery'
  WHEN "restaurant_id" = '3314' THEN 'brandywine'
  ELSE "restaurant_id"
END;--> statement-breakpoint
UPDATE "periods"
SET "restaurant_id" = CASE
  WHEN "restaurant_id" = '3056' THEN 'anteatery'
  WHEN "restaurant_id" = '3314' THEN 'brandywine'
  ELSE "restaurant_id"
END;--> statement-breakpoint
UPDATE "stations"
SET "restaurant_id" = CASE
  WHEN "restaurant_id" = '3056' THEN 'anteatery'
  WHEN "restaurant_id" = '3314' THEN 'brandywine'
  ELSE "restaurant_id"
END;--> statement-breakpoint
UPDATE "events"
SET "restaurant_id" = CASE
  WHEN "restaurant_id" = '3056' THEN 'anteatery'
  WHEN "restaurant_id" = '3314' THEN 'brandywine'
  ELSE "restaurant_id"
END;--> statement-breakpoint
DROP TYPE "public"."restaurant_id_enum";--> statement-breakpoint
CREATE TYPE "public"."restaurant_id_enum" AS ENUM('anteatery', 'brandywine');--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "restaurant_id" SET DATA TYPE "public"."restaurant_id_enum" USING "restaurant_id"::"public"."restaurant_id_enum";--> statement-breakpoint
ALTER TABLE "menus" ALTER COLUMN "restaurant_id" SET DATA TYPE "public"."restaurant_id_enum" USING "restaurant_id"::"public"."restaurant_id_enum";--> statement-breakpoint
ALTER TABLE "periods" ALTER COLUMN "restaurant_id" SET DATA TYPE "public"."restaurant_id_enum" USING "restaurant_id"::"public"."restaurant_id_enum";--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "id" SET DATA TYPE "public"."restaurant_id_enum" USING "id"::"public"."restaurant_id_enum";--> statement-breakpoint
ALTER TABLE "stations" ALTER COLUMN "restaurant_id" SET DATA TYPE "public"."restaurant_id_enum" USING "restaurant_id"::"public"."restaurant_id_enum";--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "menus_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "menus_period_id_date_restaurant_id_periods_id_date_restaurant_id_fk" FOREIGN KEY ("period_id","date","restaurant_id") REFERENCES "public"."periods"("id","date","restaurant_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "periods" ADD CONSTRAINT "periods_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "stations" ADD CONSTRAINT "stations_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "menus" ALTER COLUMN "price" SET DATA TYPE numeric(6, 2) USING NULLIF(regexp_replace("price", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "menus" ALTER COLUMN "price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "calories" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("calories", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "total_fat_g" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("total_fat_g", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "trans_fat_g" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("trans_fat_g", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "saturated_fat_g" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("saturated_fat_g", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "cholesterol_mg" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("cholesterol_mg", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "sodium_mg" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("sodium_mg", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "total_carbs_g" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("total_carbs_g", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "dietary_fiber_g" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("dietary_fiber_g", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "sugars_g" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("sugars_g", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "protein_g" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("protein_g", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "calcium" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("calcium", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "iron" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("iron", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "vitamin_a" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("vitamin_a", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ALTER COLUMN "vitamin_c" SET DATA TYPE numeric(10, 2) USING NULLIF(regexp_replace("vitamin_c", '[^0-9.-]', '', 'g'), '')::numeric;--> statement-breakpoint
CREATE INDEX "dishes_station_id_idx" ON "dishes" USING btree ("station_id");--> statement-breakpoint
CREATE INDEX "dishes_menu_id_idx" ON "dishes" USING btree ("menu_id");--> statement-breakpoint
CREATE INDEX "dishes_name_idx" ON "dishes" USING btree ("name");--> statement-breakpoint
CREATE INDEX "dishes_category_idx" ON "dishes" USING btree ("category");--> statement-breakpoint
CREATE INDEX "events_restaurant_id_idx" ON "events" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "menus_restaurant_date_idx" ON "menus" USING btree ("restaurant_id","date");--> statement-breakpoint
CREATE INDEX "menus_restaurant_id_idx" ON "menus" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "menus_date_idx" ON "menus" USING btree ("date");--> statement-breakpoint
CREATE INDEX "menus_period_id_idx" ON "menus" USING btree ("period_id");--> statement-breakpoint
CREATE INDEX "periods_restaurant_date_idx" ON "periods" USING btree ("restaurant_id","date");--> statement-breakpoint
CREATE INDEX "stations_restaurant_id_idx" ON "stations" USING btree ("restaurant_id");--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "menus_price_nonnegative" CHECK (price IS NULL OR price >= 0);--> statement-breakpoint
ALTER TABLE "logged_meals" ADD CONSTRAINT "servings_is_valid" CHECK ((("logged_meals"."servings" * 2) = floor("logged_meals"."servings" * 2)) AND ("logged_meals"."servings" >= 0.5));