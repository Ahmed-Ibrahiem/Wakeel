CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"email" text,
	"address" text,
	"first_contact_date" date DEFAULT CURRENT_DATE NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clients_id_user_unique" UNIQUE("user_id","id")
);
--> statement-breakpoint
CREATE INDEX "client_user_name_idx" ON "clients" ("user_id","full_name");--> statement-breakpoint
CREATE INDEX "client_archive_at_idx" ON "clients" ("user_id","archived_at");--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;