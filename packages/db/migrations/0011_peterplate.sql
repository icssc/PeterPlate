ALTER TABLE "ratings" ADD COLUMN "restaurant" "restaurant_id_enum" DEFAULT 'anteatery' NOT NULL;--> statement-breakpoint
ALTER TABLE "ratings" ALTER COLUMN "restaurant" DROP DEFAULT;