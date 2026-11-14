import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { cases } from "./cases";
import { hearingStatusEnum, hearingTypeEnum } from "./enums";
import { timestamps } from "./columns";

export const hearings = pgTable(
  "hearings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    caseId: uuid("case_id").notNull(),

    hearingAt: timestamp("hearing_at", { withTimezone: true }).notNull(),
    type: hearingTypeEnum("type").notNull().default("pleading"),
    status: hearingStatusEnum("status").notNull().default("scheduled"),
    location: text("location"), // But if it is different from the court of the case
    outcome: text("outcome"), // Hearing decision
    notes: text("notes"),

    reminderDaySentAt: timestamp("reminder_day_sent_at", {
      withTimezone: true,
    }),
    reminderHoursSentAt: timestamp("reminder_hours_sent_at", {
      withTimezone: true,
    }),
    ...timestamps,
  },
  (t) => [
    // Without onDelete = NO ACTION: The case in which there are hearigns cannot be deleted (23503)
    foreignKey({
      name: "hearings_case_owner_fk",
      columns: [t.caseId, t.userId],
      foreignColumns: [cases.id, cases.userId],
    }),
    index("hearings_user_hearing_at_idx").on(t.userId, t.hearingAt),
    index("hearings_case_hearing_at_idx").on(t.caseId, t.hearingAt),
  ],
);
