import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const userSettings = pgTable("user_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),

  reminderDaysBefore: integer("reminder_days_before").notNull().default(1),
  reminderHoursBefore: integer("reminder_hours_before").notNull().default(3),
  timeZone: text("timezone").notNull().default("Africa/Cairo"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
