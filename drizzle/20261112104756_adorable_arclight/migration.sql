CREATE TYPE "case_status" AS ENUM('ongoing', 'postponed', 'closed');--> statement-breakpoint
CREATE TYPE "case_type" AS ENUM('civil', 'criminal', 'commercial', 'family', 'labor', 'other');--> statement-breakpoint
CREATE TABLE "cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"client_id" uuid NOT NULL,
	"case_number" text NOT NULL,
	"case_type" "case_type" NOT NULL,
	"court_name" text NOT NULL,
	"opposing_party" text,
	"status" "case_status" DEFAULT 'ongoing'::"case_status" NOT NULL,
	"judgment_date" date,
	"notes" text,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cases_id_user_unique" UNIQUE("id","user_id")
);
--> statement-breakpoint
CREATE INDEX "cases_user_client_idx" ON "cases" ("user_id","client_id");--> statement-breakpoint
CREATE INDEX "cases_user_status_idx" ON "cases" ("user_id","status");--> statement-breakpoint
CREATE INDEX "cases_user_case_number_idx" ON "cases" ("user_id","case_number");--> statement-breakpoint
CREATE INDEX "cases_user_updated_idx" ON "cases" ("user_id","updated_at");--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_client_owner_fk" FOREIGN KEY ("client_id","user_id") REFERENCES "clients"("id","user_id");