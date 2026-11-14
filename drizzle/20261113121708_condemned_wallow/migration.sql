CREATE TABLE "hearings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"case_id" uuid NOT NULL,
	"hearing_at" timestamp with time zone NOT NULL,
	"type" "hearing_type" DEFAULT 'pleading'::"hearing_type" NOT NULL,
	"status" "hearing_status" DEFAULT 'scheduled'::"hearing_status" NOT NULL,
	"location" text,
	"outcome" text,
	"notes" text,
	"reminder_day_sent_at" timestamp with time zone,
	"reminder_hours_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "hearings_user_hearing_at_idx" ON "hearings" ("user_id","hearing_at");--> statement-breakpoint
CREATE INDEX "hearings_case_hearing_at_idx" ON "hearings" ("case_id","hearing_at");--> statement-breakpoint
ALTER TABLE "hearings" ADD CONSTRAINT "hearings_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hearings" ADD CONSTRAINT "hearings_case_owner_fk" FOREIGN KEY ("case_id","user_id") REFERENCES "cases"("id","user_id");