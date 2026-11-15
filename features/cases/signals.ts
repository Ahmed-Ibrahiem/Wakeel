import { addDays, todayIn } from "@/lib/dates";
import { toZonedParts } from "@/lib/zoned-time";

const URGENT_WINDOW_MS = 48 * 60 * 60 * 1000;
const URGENT_WINDOW_DAYS = 2;

type SignalInput = {
  status: string;
  archivedAt: Date | null;
  judgmentDate: string | null;
  updatedAt: Date;
  nextHearingAt: Date | null;
  lastHearingAt: Date | null;
  nextDeadlineDate: string | null;
};

export type CaseSignals = {
  urgent: boolean;
  footer: { label: string; date: string; warning: boolean };
  deadline: { date: string; overdue: boolean } | null;
};



const stamp = (at: Date, timeZone: string) => {
  const p = toZonedParts(at, timeZone);
  return `${p.date} ${p.time}`;
};

export function getCaseSignals(
  item: SignalInput,
  timeZone: string,
): CaseSignals {
  const now = Date.now();
  const today = todayIn(timeZone); // "YYYY-MM-DD" in the lawyer's zone
  const active = item.status !== "closed" && !item.archivedAt;

  // Urgent = nearest hearing within 48 hours (or already past without a decision),
  // or a pending deadline due within 2 days (or already overdue).
  const hearingUrgent =
    item.nextHearingAt !== null &&
    item.nextHearingAt.getTime() <= now + URGENT_WINDOW_MS;
  const deadlineUrgent =
    item.nextDeadlineDate !== null &&
    item.nextDeadlineDate <= addDays(today, URGENT_WINDOW_DAYS);
  const urgent = active && (hearingUrgent || deadlineUrgent);

  let footer: CaseSignals["footer"];
  if (item.nextHearingAt) {
    const undecided = item.nextHearingAt.getTime() < now;
    footer = {
      label: undecided ? "جلسة بدون قرار" : "الجلسة القادمة",
      date: stamp(item.nextHearingAt, timeZone),
      warning: undecided,
    };
  } else if (item.status === "ongoing" && !item.archivedAt) {
    footer = { label: "لا توجد جلسة قادمة", date: "", warning: true };
  } else if (item.judgmentDate) {
    footer = { label: "تاريخ الحكم", date: item.judgmentDate, warning: false };
  } else if (item.lastHearingAt) {
    footer = {
      label: "آخر جلسة",
      date: toZonedParts(item.lastHearingAt, timeZone).date,
      warning: false,
    };
  } else {
    footer = {
      label: "آخر تحديث",
      date: toZonedParts(item.updatedAt, timeZone).date,
      warning: false,
    };
  }

  const deadline = item.nextDeadlineDate
    ? { date: item.nextDeadlineDate, overdue: item.nextDeadlineDate < today }
    : null;

  return { urgent, footer, deadline };
}