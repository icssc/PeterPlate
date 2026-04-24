CREATE TABLE "user_goals" (
	"user_id" text PRIMARY KEY NOT NULL,
	"calorie_goal" integer DEFAULT 2000 NOT NULL,
	"protein_goal" integer DEFAULT 75 NOT NULL,
	"carb_goal" integer DEFAULT 250 NOT NULL,
	"fat_goal" integer DEFAULT 50 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_goals" ADD CONSTRAINT "user_goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;