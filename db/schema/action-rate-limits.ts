import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const ActionRateLimits = pgTable(
  "action_rate_limits",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull().default(1),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("action_rate_limits_expires_idx").on(t.expiresAt)],
);
