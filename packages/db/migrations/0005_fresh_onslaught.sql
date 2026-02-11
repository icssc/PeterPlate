CREATE TABLE "user_allergies" (
	"userId" text NOT NULL,
	"allergy" text NOT NULL,
	CONSTRAINT "user_allergies_userId_allergy_pk" PRIMARY KEY("userId","allergy")
);
--> statement-breakpoint
CREATE TABLE "user_dietary_preferences" (
	"userId" text NOT NULL,
	"preference" text NOT NULL,
	CONSTRAINT "user_dietary_preferences_userId_preference_pk" PRIMARY KEY("userId","preference")
);
--> statement-breakpoint
ALTER TABLE "user_allergies" ADD CONSTRAINT "user_allergies_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_dietary_preferences" ADD CONSTRAINT "user_dietary_preferences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;