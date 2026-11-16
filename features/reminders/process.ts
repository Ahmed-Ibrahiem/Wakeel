import "server-only";
import { sendEmail } from "@/lib/email";
import {
  claimDeadlineReminder,
  claimHearingDayReminder,
  claimHearingHoursReminder,
  releaseDeadlineReminder,
  releaseHearingDayReminder,
  releaseHearingHoursReminder,
} from "./claims";
import {
  findDeadlinesDue,
  findHearingsDueByDays,
  findHearingsDueByHours,
} from "./queries";
import {
  deadlineReminderEmail,
  hearingReminderEmail,
  type ReminderEmail,
} from "./templates";

type Counts = { found: number; sent: number; skipped: number; failed: number };

async function deliver<T extends { id: string; email: string }>(
  items: T[],
  claim: (id: string) => Promise<boolean>,
  release: (id: string) => Promise<void>,
  build: (item: T) => ReminderEmail,
): Promise<Counts> {
  const counts: Counts = { found: items.length, sent: 0, skipped: 0, failed: 0 };

  // Sequential on purpose: Resend allows about 10 requests per second
  for (const item of items) {
    // Lost the claim: another run already handles this reminder
    if (!(await claim(item.id))) {
      counts.skipped++;
      continue;
    }

    try {
      const sent = await sendEmail({ to: item.email, ...build(item) });
      if (sent) {
        counts.sent++;
        continue;
      }
    } catch (err) {
      console.error("[reminders] sending threw:", err);
    }

    // Sending failed: free the claim so the next run retries this reminder
    try {
      await release(item.id);
    } catch (err) {
      console.error("[reminders] failed to release a claim:", err);
    }
    counts.failed++;
  }

  return counts;
}

export async function processReminders() {
  const [byHours, byDays, deadlines] = await Promise.all([
    findHearingsDueByHours(),
    findHearingsDueByDays(),
    findDeadlinesDue(),
  ]);

  return {
    hearingsByHours: await deliver(
      byHours,
      claimHearingHoursReminder,
      releaseHearingHoursReminder,
      hearingReminderEmail,
    ),
    hearingsByDays: await deliver(
      byDays,
      claimHearingDayReminder,
      releaseHearingDayReminder,
      hearingReminderEmail,
    ),
    deadlines: await deliver(
      deadlines,
      claimDeadlineReminder,
      releaseDeadlineReminder,
      deadlineReminderEmail,
    ),
  };
}