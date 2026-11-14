CREATE TYPE "deadline_status" AS ENUM('pending', 'done');--> statement-breakpoint
CREATE TABLE "deadlines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"case_id" uuid NOT NULL,
	"title" text NOT NULL,
	"due_date" date NOT NULL,
	"status" "deadline_status" DEFAULT 'pending'::"deadline_status" NOT NULL,
	"completed_at" timestamp with time zone,
	"notes" text,
	"reminder_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "deadlines_user_due_date_idx" ON "deadlines" ("user_id","due_date");--> statement-breakpoint
CREATE INDEX "deadlines_case_idx" ON "deadlines" ("case_id");--> statement-breakpoint
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_case_owner_fk" FOREIGN KEY ("case_id","user_id") REFERENCES "cases"("id","user_id");