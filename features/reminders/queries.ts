import "server-only";
import { sql } from "drizzle-orm";
import { db } from "@/db";

// Day-based reminders go out from this hour in the lawyer's own time zone
export const DAY_REMINDER_HOUR = 8;

// Small batches keep each run well under cron-job.org's 30-second timeout;
// anything left over is picked up by the next run a few minutes later
const BATCH_LIMIT = 20;

export type DueHearing = {
  id: string;
  userId: string;
  caseId: string;
  caseNumber: string;
  courtName: string;
  hearingAt: string; // ISO 8601 in UTC, e.g. 2027-01-01T07:00:00Z
  email: string;
  timeZone: string;
};

export type DueDeadline = {
  id: string;
  userId: string;
  caseId: string;
  caseNumber: string;
  courtName: string;
  title: string;
  dueDate: string; // yyyy-mm-dd
  email: string;
  timeZone: string;
};

// "N hours before": the window is [hearing_at - N hours, hearing_at)
export async function findHearingsDueByHours(): Promise<DueHearing[]> {
  const result = await db.execute<DueHearing>(sql`
    SELECT h.id, h.user_id AS "userId", h.case_id AS "caseId",
           c.case_number AS "caseNumber", c.court_name AS "courtName",
           to_char(h.hearing_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "hearingAt",
           u.email, s.timezone AS "timeZone"
    FROM hearings h
    JOIN user_settings s ON s.user_id = h.user_id
    JOIN "user" u ON u.id = h.user_id
    JOIN cases c ON c.id = h.case_id AND c.user_id = h.user_id
    WHERE h.status = 'scheduled'
      AND h.reminder_hours_sent_at IS NULL
      AND s.reminder_hours_before > 0
      AND h.hearing_at > now()
      AND h.hearing_at <= now() + make_interval(hours => s.reminder_hours_before)
    LIMIT ${BATCH_LIMIT}
  `);
  return result.rows;
}

// "N days before": compare calendar dates in the lawyer's zone, from 08:00 local
export async function findHearingsDueByDays(): Promise<DueHearing[]> {
  const result = await db.execute<DueHearing>(sql`
    SELECT h.id, h.user_id AS "userId", h.case_id AS "caseId",
           c.case_number AS "caseNumber", c.court_name AS "courtName",
           to_char(h.hearing_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "hearingAt",
           u.email, s.timezone AS "timeZone"
    FROM hearings h
    JOIN user_settings s ON s.user_id = h.user_id
    JOIN "user" u ON u.id = h.user_id
    JOIN cases c ON c.id = h.case_id AND c.user_id = h.user_id
    WHERE h.status = 'scheduled'
      AND h.reminder_day_sent_at IS NULL
      AND s.reminder_days_before > 0
      AND h.hearing_at > now()
      AND (h.hearing_at AT TIME ZONE s.timezone)::date - s.reminder_days_before
          <= (now() AT TIME ZONE s.timezone)::date
      AND extract(hour FROM now() AT TIME ZONE s.timezone) >= ${DAY_REMINDER_HOUR}
    LIMIT ${BATCH_LIMIT}
  `);
  return result.rows;
}

// Same day rule for deadlines; overdue ones are excluded (a reminder is too late)
export async function findDeadlinesDue(): Promise<DueDeadline[]> {
  const result = await db.execute<DueDeadline>(sql`
    SELECT d.id, d.user_id AS "userId", d.case_id AS "caseId",
           c.case_number AS "caseNumber", c.court_name AS "courtName",
           d.title, d.due_date::text AS "dueDate",
           u.email, s.timezone AS "timeZone"
    FROM deadlines d
    JOIN user_settings s ON s.user_id = d.user_id
    JOIN "user" u ON u.id = d.user_id
    JOIN cases c ON c.id = d.case_id AND c.user_id = d.user_id
    WHERE d.status = 'pending'
      AND d.reminder_sent_at IS NULL
      AND s.reminder_days_before > 0
      AND d.due_date >= (now() AT TIME ZONE s.timezone)::date
      AND d.due_date - s.reminder_days_before
          <= (now() AT TIME ZONE s.timezone)::date
      AND extract(hour FROM now() AT TIME ZONE s.timezone) >= ${DAY_REMINDER_HOUR}
    LIMIT ${BATCH_LIMIT}
  `);
  return result.rows;
}