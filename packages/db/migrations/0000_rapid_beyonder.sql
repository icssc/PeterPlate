DO $$ BEGIN
 CREATE TYPE "public"."restaurant_id_enum" AS ENUM('3056', '3314');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."restaurant_name_enum" AS ENUM('anteatery', 'brandywine');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contributors" (
	"login" text PRIMARY KEY NOT NULL,
	"avatar_url" text NOT NULL,
	"contributions" integer NOT NULL,
	"name" text,
	"bio" text DEFAULT 'ZotMeal Contributor',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "diet_restrictions" (
	"dish_id" text PRIMARY KEY NOT NULL,
	"contains_eggs" boolean,
	"contains_fish" boolean,
	"contains_milk" boolean,
	"contains_peanuts" boolean,
	"contains_sesame" boolean,
	"contains_shellfish" boolean,
	"contains_soy" boolean,
	"contains_tree_nuts" boolean,
	"contains_wheat" boolean,
	"is_gluten_free" boolean,
	"is_halal" boolean,
	"is_kosher" boolean,
	"is_locally_grown" boolean,
	"is_organic" boolean,
	"is_vegan" boolean,
	"is_vegetarian" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dishes" (
	"id" text PRIMARY KEY NOT NULL,
	"station_id" text NOT NULL,
	"menu_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"ingredients" text DEFAULT 'Ingredient Statement Not Available',
	"category" text DEFAULT 'Other' NOT NULL,
	"num_ratings" integer DEFAULT 0 NOT NULL,
	"total_rating" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"title" text NOT NULL,
	"image" text,
	"restaurant_id" "restaurant_id_enum" NOT NULL,
	"short_description" text,
	"long_description" text,
	"start" timestamp,
	"end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "events_title_restaurant_id_start_pk" PRIMARY KEY("title","restaurant_id","start")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dishes_to_menus" (
	"menu_id" text NOT NULL,
	"dish_id" text NOT NULL,
	CONSTRAINT "dishes_to_menus_menu_id_dish_id_pk" PRIMARY KEY("menu_id","dish_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menus" (
	"id" text PRIMARY KEY NOT NULL,
	"period_id" text NOT NULL,
	"date" date NOT NULL,
	"restaurant_id" "restaurant_id_enum" NOT NULL,
	"price" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrition_infos" (
	"dish_id" text PRIMARY KEY NOT NULL,
	"serving_size" text,
	"serving_unit" text,
	"calories" text,
	"total_fat_g" text,
	"trans_fat_g" text,
	"saturated_fat_g" text,
	"cholesterol_mg" text,
	"sodium_mg" text,
	"total_carbs_g" text,
	"dietary_fiber_g" text,
	"sugars_g" text,
	"protein_g" text,
	"calcium" text,
	"iron" text,
	"vitamin_a" text,
	"vitamin_c" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "periods" (
	"id" text NOT NULL,
	"date" date NOT NULL,
	"restaurant_id" "restaurant_id_enum" NOT NULL,
	"start" time NOT NULL,
	"end" time NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "periods_id_date_restaurant_id_pk" PRIMARY KEY("id","date","restaurant_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pins" (
	"user_id" text NOT NULL,
	"dish_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "pins_user_id_dish_id_pk" PRIMARY KEY("user_id","dish_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "push_tokens" (
	"token" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ratings" (
	"user_id" text NOT NULL,
	"dish_id" text NOT NULL,
	"rating" smallint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "ratings_user_id_dish_id_pk" PRIMARY KEY("user_id","dish_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurants" (
	"id" "restaurant_id_enum" PRIMARY KEY NOT NULL,
	"name" "restaurant_name_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"restaurant_id" "restaurant_id_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "diet_restrictions" ADD CONSTRAINT "diet_restrictions_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dishes" ADD CONSTRAINT "dishes_station_id_stations_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."stations"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dishes" ADD CONSTRAINT "dishes_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dishes_to_menus" ADD CONSTRAINT "dishes_to_menus_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dishes_to_menus" ADD CONSTRAINT "dishes_to_menus_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menus" ADD CONSTRAINT "menus_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menus" ADD CONSTRAINT "menus_period_id_date_restaurant_id_periods_id_date_restaurant_id_fk" FOREIGN KEY ("period_id","date","restaurant_id") REFERENCES "public"."periods"("id","date","restaurant_id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nutrition_infos" ADD CONSTRAINT "nutrition_infos_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "periods" ADD CONSTRAINT "periods_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pins" ADD CONSTRAINT "pins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pins" ADD CONSTRAINT "pins_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ratings" ADD CONSTRAINT "ratings_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stations" ADD CONSTRAINT "stations_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
