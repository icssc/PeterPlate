CREATE TABLE "user_goals_by_day" (
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"calorie_goal" integer DEFAULT 2000 NOT NULL,
	"protein_goal" integer DEFAULT 100 NOT NULL,
	"carb_goal" integer DEFAULT 250 NOT NULL,
	"fat_goal" integer DEFAULT 50 NOT NULL,
	CONSTRAINT "user_goals_by_day_user_id_date_pk" PRIMARY KEY("user_id","date")
);
--> statement-breakpoint
ALTER TABLE "user_goals_by_day" ADD CONSTRAINT "user_goals_by_day_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;