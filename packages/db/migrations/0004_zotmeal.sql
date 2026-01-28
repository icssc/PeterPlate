ALTER TABLE "logged_meals" DROP CONSTRAINT "servings_is_valid";--> statement-breakpoint
ALTER TABLE "dishes" DROP CONSTRAINT "dishes_menu_id_menus_id_fk";
--> statement-breakpoint
DROP INDEX "dishes_menu_id_idx";--> statement-breakpoint
ALTER TABLE "dishes" DROP COLUMN "menu_id";--> statement-breakpoint
ALTER TABLE "logged_meals" ADD CONSTRAINT "servings_is_valid" CHECK ((("logged_meals"."servings" * 2) = floor("logged_meals"."servings" * 2)) AND ("logged_meals"."servings" >= 0.5));