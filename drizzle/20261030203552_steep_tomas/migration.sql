CREATE TABLE "user_settings" (
	"user_id" text PRIMARY KEY,
	"reminder_days_before" integer DEFAULT 1 NOT NULL,
	"reminder_hours_before" integer DEFAULT 3 NOT NULL,
	"timezone" text DEFAULT 'Africa/Cairo' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;