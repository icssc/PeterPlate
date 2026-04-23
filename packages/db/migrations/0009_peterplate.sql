ALTER TABLE "favorites" DROP CONSTRAINT "pins_pk";--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_pk" PRIMARY KEY("user_id","dish_id");