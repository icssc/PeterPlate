CREATE TYPE IF NOT EXISTS "public"."restaurant_id_enum" AS ENUM('anteatery', 'brandywine');--> statement-breakpoint
CREATE TYPE IF NOT EXISTS "public"."restaurant_name_enum" AS ENUM('anteatery', 'brandywine');--> statement-breakpoint
CREATE TABLE "contributors" (
	"login" text PRIMARY KEY NOT NULL,
	"avatar_url" text NOT NULL,
	"contributions" integer NOT NULL,
	"name" text,
	"bio" text DEFAULT 'PeterPlate Contributor',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "diet_restrictions" (
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
CREATE TABLE "dishes" (
	"id" text PRIMARY KEY NOT NULL,
	"station_id" text NOT NULL,
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
CREATE TABLE "events" (
	"title" text NOT NULL,
	"image" text,
	"restaurant_id" "restaurant_id_enum" NOT NULL,
	"short_description" text,
	"long_description" text,
	"start" timestamp,
	"end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "events_pk" PRIMARY KEY("title","restaurant_id","start")
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"user_id" text NOT NULL,
	"dish_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "pins_pk" PRIMARY KEY("user_id","dish_id")
);
--> statement-breakpoint
CREATE TABLE "dishes_to_menus" (
	"menu_id" text NOT NULL,
	"dish_id" text NOT NULL,
	CONSTRAINT "dishes_to_menus_pk" PRIMARY KEY("menu_id","dish_id")
);
--> statement-breakpoint
CREATE TABLE "menus" (
	"id" text PRIMARY KEY NOT NULL,
	"period_id" text NOT NULL,
	"date" date NOT NULL,
	"restaurant_id" "restaurant_id_enum" NOT NULL,
	"price" numeric(6, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "menus_price_nonnegative" CHECK (price IS NULL OR price >= 0)
);
--> statement-breakpoint
CREATE TABLE "nutrition_infos" (
	"dish_id" text PRIMARY KEY NOT NULL,
	"serving_size" text,
	"serving_unit" text,
	"calories" numeric(10, 2),
	"total_fat_g" numeric(10, 2),
	"trans_fat_g" numeric(10, 2),
	"saturated_fat_g" numeric(10, 2),
	"cholesterol_mg" numeric(10, 2),
	"sodium_mg" numeric(10, 2),
	"total_carbs_g" numeric(10, 2),
	"dietary_fiber_g" numeric(10, 2),
	"sugars_g" numeric(10, 2),
	"protein_g" numeric(10, 2),
	"calcium" numeric(10, 2),
	"iron" numeric(10, 2),
	"vitamin_a" numeric(10, 2),
	"vitamin_c" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "logged_meals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"dish_id" text NOT NULL,
	"dish_name" text NOT NULL,
	"servings" real DEFAULT 1 NOT NULL,
	"eaten_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "servings_is_valid" CHECK ((("logged_meals"."servings" * 2) = floor("logged_meals"."servings" * 2)) AND ("logged_meals"."servings" >= 0.5))
);
--> statement-breakpoint
CREATE TABLE "periods" (
	"id" text NOT NULL,
	"date" date NOT NULL,
	"restaurant_id" "restaurant_id_enum" NOT NULL,
	"start" time NOT NULL,
	"end" time NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "periods_pk" PRIMARY KEY("id","date","restaurant_id")
);
--> statement-breakpoint
CREATE TABLE "push_tokens" (
	"token" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"user_id" text NOT NULL,
	"dish_id" text NOT NULL,
	"rating" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "ratings_pk" PRIMARY KEY("user_id","dish_id")
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" "restaurant_id_enum" PRIMARY KEY NOT NULL,
	"name" "restaurant_name_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "stations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"restaurant_id" "restaurant_id_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
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
	"scope" text,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
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
ALTER TABLE "diet_restrictions" ADD CONSTRAINT "diet_restrictions_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_station_id_stations_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."stations"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "dishes_to_menus" ADD CONSTRAINT "dishes_to_menus_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dishes_to_menus" ADD CONSTRAINT "dishes_to_menus_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "menus_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "menus_period_id_date_restaurant_id_periods_id_date_restaurant_id_fk" FOREIGN KEY ("period_id","date","restaurant_id") REFERENCES "public"."periods"("id","date","restaurant_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "nutrition_infos" ADD CONSTRAINT "nutrition_infos_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "logged_meals" ADD CONSTRAINT "logged_meals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logged_meals" ADD CONSTRAINT "logged_meals_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "periods" ADD CONSTRAINT "periods_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "stations" ADD CONSTRAINT "stations_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dishes_station_id_idx" ON "dishes" USING btree ("station_id");--> statement-breakpoint
CREATE INDEX "dishes_name_idx" ON "dishes" USING btree ("name");--> statement-breakpoint
CREATE INDEX "dishes_category_idx" ON "dishes" USING btree ("category");--> statement-breakpoint
CREATE INDEX "events_restaurant_id_idx" ON "events" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "menus_restaurant_date_idx" ON "menus" USING btree ("restaurant_id","date");--> statement-breakpoint
CREATE INDEX "menus_restaurant_id_idx" ON "menus" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "menus_date_idx" ON "menus" USING btree ("date");--> statement-breakpoint
CREATE INDEX "menus_period_id_idx" ON "menus" USING btree ("period_id");--> statement-breakpoint
CREATE INDEX "periods_restaurant_date_idx" ON "periods" USING btree ("restaurant_id","date");--> statement-breakpoint
CREATE INDEX "stations_restaurant_id_idx" ON "stations" USING btree ("restaurant_id");