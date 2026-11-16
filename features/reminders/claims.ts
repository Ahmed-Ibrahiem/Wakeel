import "server-only";
import { sql } from "drizzle-orm";
import { db } from "@/db";

// Each claim is ONE atomic UPDATE: it only succeeds for the single caller
// that finds the flag still NULL. Any concurrent run gets zero rows back.

export async function claimHearingHoursReminder(id: string): Promise<boolean> {
  const result = await db.execute(sql`
    UPDATE hearings
    SET reminder_hours_sent_at = now()
    WHERE id = ${id}
      AND status = 'scheduled'
      AND reminder_hours_sent_at IS NULL
    RETURNING id
  `);
  return result.rows.length === 1;
}

export async function claimHearingDayReminder(id: string): Promise<boolean> {
  const result = await db.execute(sql`
    UPDATE hearings
    SET reminder_day_sent_at = now()
    WHERE id = ${id}
      AND status = 'scheduled'
      AND reminder_day_sent_at IS NULL
    RETURNING id
  `);
  return result.rows.length === 1;
}

export async function claimDeadlineReminder(id: string): Promise<boolean> {
  const result = await db.execute(sql`
    UPDATE deadlines
    SET reminder_sent_at = now()
    WHERE id = ${id}
      AND status = 'pending'
      AND reminder_sent_at IS NULL
    RETURNING id
  `);
  return result.rows.length === 1;
}

// Release a claim when sending failed, so the next run retries
export async function releaseHearingHoursReminder(id: string) {
  await db.execute(
    sql`UPDATE hearings SET reminder_hours_sent_at = NULL WHERE id = ${id}`,
  );
}

export async function releaseHearingDayReminder(id: string) {
  await db.execute(
    sql`UPDATE hearings SET reminder_day_sent_at = NULL WHERE id = ${id}`,
  );
}

export async function releaseDeadlineReminder(id: string) {
  await db.execute(
    sql`UPDATE deadlines SET reminder_sent_at = NULL WHERE id = ${id}`,
  );
}