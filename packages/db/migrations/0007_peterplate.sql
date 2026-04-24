ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "dishes_to_menus" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "menus" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "nutrition_infos" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "periods" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "restaurants" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "stations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "events" CASCADE;--> statement-breakpoint
DROP TABLE "dishes_to_menus" CASCADE;--> statement-breakpoint
DROP TABLE "menus" CASCADE;--> statement-breakpoint
DROP TABLE "nutrition_infos" CASCADE;--> statement-breakpoint
DROP TABLE "periods" CASCADE;--> statement-breakpoint
DROP TABLE "restaurants" CASCADE;--> statement-breakpoint
DROP TABLE "stations" CASCADE;--> statement-breakpoint
--> statement-breakpoint
DROP INDEX "dishes_station_id_idx";--> statement-breakpoint
DROP INDEX "dishes_name_idx";--> statement-breakpoint
DROP INDEX "dishes_category_idx";--> statement-breakpoint
ALTER TABLE "dishes" DROP COLUMN "station_id";--> statement-breakpoint
ALTER TABLE "dishes" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "dishes" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "dishes" DROP COLUMN "ingredients";--> statement-breakpoint
ALTER TABLE "dishes" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "dishes" DROP COLUMN "image_url";