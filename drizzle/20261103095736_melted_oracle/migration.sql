CREATE TABLE "action_rate_limits" (
	"key" text PRIMARY KEY,
	"count" integer DEFAULT 1 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "action_rate_limits_expires_idx" ON "action_rate_limits" ("expires_at");