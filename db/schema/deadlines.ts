import {
  date,
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { cases } from "./cases";
import { deadlineStatusEnum } from "./enums";
import { timestamps } from "./columns";

export const deadlines = pgTable(
  "deadlines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    caseId: uuid("case_id").notNull(),

    title: text("title").notNull(),
    dueDate: date("due_date", { mode: "string" }).notNull(),
    status: deadlineStatusEnum("status").notNull().default("pending"),
    completedAt: timestamp("completed_at", { withTimezone: true }), 
    notes: text("notes"),

    reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),

    ...timestamps,
  },
  (t) => [
    // No onDelete (NO ACTION): a case with deadlines cannot be deleted (error 23503)
    foreignKey({
      name: "deadlines_case_owner_fk",
      columns: [t.caseId, t.userId],
      foreignColumns: [cases.id, cases.userId],
    }),
    index("deadlines_user_due_date_idx").on(t.userId, t.dueDate),
    index("deadlines_case_idx").on(t.caseId),
  ],
);
