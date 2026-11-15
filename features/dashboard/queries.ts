import "server-only";
import { cache } from "react";
import { and, asc, count, desc, eq, gte, isNull, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { cases, clients, deadlines, hearings } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";
import { addDays, todayIn } from "@/lib/dates";
import { dayStartUtc } from "@/lib/zoned-time";

// Computed once per request and shared by all dashboard sections
const getContext = cache(async () => {
  const { user } = await requireSession();
  const { timeZone } = await getUserSettings(user.id);
  const today = todayIn(timeZone);

  return {
    userId: user.id,
    timeZone,
    today, // "YYYY-MM-DD" in the lawyer's zone
    todayStart: dayStartUtc(today, timeZone),
    tomorrowEnd: dayStartUtc(addDays(today, 2), timeZone),
    weekEnd: dayStartUtc(addDays(today, 7), timeZone),
    todayEnd: dayStartUtc(addDays(today, 1), timeZone),
  };
});

// A hearing/deadline belongs to the dashboard only if its case is not archived
const caseJoinHearing = and(
  eq(cases.id, hearings.caseId),
  eq(cases.userId, hearings.userId),
);
const caseJoinDeadline = and(
  eq(cases.id, deadlines.caseId),
  eq(cases.userId, deadlines.userId),
);
const clientJoin = and(
  eq(clients.id, cases.clientId),
  eq(clients.userId, cases.userId),
);

export const dashboardStats = cache(async () => {
  const c = await getContext();
  // Timestamps go in as ISO strings with an explicit cast
  const at = (d: Date) => sql`${d.toISOString()}::timestamptz`;

  const [[ongoing], [h], [d]] = await Promise.all([
    db
      .select({ value: count() })
      .from(cases)
      .where(
        and(
          eq(cases.userId, c.userId),
          eq(cases.status, "ongoing"),
          isNull(cases.archivedAt),
        ),
      ),
    db
      .select({
        today: sql<number>`count(*) filter (where ${hearings.hearingAt} >= ${at(c.todayStart)} and ${hearings.hearingAt} < ${at(c.todayEnd)})::int`,
        week: sql<number>`count(*) filter (where ${hearings.hearingAt} >= ${at(c.todayStart)} and ${hearings.hearingAt} < ${at(c.weekEnd)})::int`,
        undecided: sql<number>`count(*) filter (where ${hearings.hearingAt} < ${at(c.todayStart)})::int`,
      })
      .from(hearings)
      .innerJoin(cases, caseJoinHearing)
      .where(
        and(
          eq(hearings.userId, c.userId),
          eq(hearings.status, "scheduled"),
          isNull(cases.archivedAt),
        ),
      ),
    db
      .select({
        pending: count(),
        overdue: sql<number>`count(*) filter (where ${deadlines.dueDate} < ${c.today}::date)::int`,
      })
      .from(deadlines)
      .innerJoin(cases, caseJoinDeadline)
      .where(
        and(
          eq(deadlines.userId, c.userId),
          eq(deadlines.status, "pending"),
          isNull(cases.archivedAt),
        ),
      ),
  ]);

  return {
    ongoingCases: ongoing.value,
    hearingsToday: h.today,
    hearingsWeek: h.week,
    undecidedHearings: h.undecided,
    pendingDeadlines: d.pending,
    overdueDeadlines: d.overdue,
  };
});

const hearingRow = {
  id: hearings.id,
  caseId: hearings.caseId,
  hearingAt: hearings.hearingAt,
  type: hearings.type,
  notes: hearings.notes,
  caseNumber: cases.caseNumber,
  courtName: cases.courtName,
  clientName: clients.fullName,
};

// Scheduled hearings of today and tomorrow (lawyer's zone), earliest first
export async function scheduleHearings() {
  const c = await getContext();

  const items = await db
    .select(hearingRow)
    .from(hearings)
    .innerJoin(cases, caseJoinHearing)
    .innerJoin(clients, clientJoin)
    .where(
      and(
        eq(hearings.userId, c.userId),
        eq(hearings.status, "scheduled"),
        isNull(cases.archivedAt),
        gte(hearings.hearingAt, c.todayStart),
        lt(hearings.hearingAt, c.tomorrowEnd),
      ),
    )
    .orderBy(asc(hearings.hearingAt), asc(hearings.id))
    .limit(30);

  return { items, timeZone: c.timeZone, todayEnd: c.todayEnd };
}

// Hearings from before today that are still "scheduled": nobody recorded a decision
export async function undecidedHearings() {
  const c = await getContext();

  const items = await db
    .select(hearingRow)
    .from(hearings)
    .innerJoin(cases, caseJoinHearing)
    .innerJoin(clients, clientJoin)
    .where(
      and(
        eq(hearings.userId, c.userId),
        eq(hearings.status, "scheduled"),
        isNull(cases.archivedAt),
        lt(hearings.hearingAt, c.todayStart),
      ),
    )
    .orderBy(asc(hearings.hearingAt), asc(hearings.id))
    .limit(5);

  return { items, timeZone: c.timeZone };
}

// Pending deadlines, earliest first, so overdue ones come on top
export async function upcomingDeadlines() {
  const c = await getContext();

  const items = await db
    .select({
      id: deadlines.id,
      caseId: deadlines.caseId,
      title: deadlines.title,
      dueDate: deadlines.dueDate,
      caseNumber: cases.caseNumber,
      clientName: clients.fullName,
    })
    .from(deadlines)
    .innerJoin(cases, caseJoinDeadline)
    .innerJoin(clients, clientJoin)
    .where(
      and(
        eq(deadlines.userId, c.userId),
        eq(deadlines.status, "pending"),
        isNull(cases.archivedAt),
      ),
    )
    .orderBy(asc(deadlines.dueDate), asc(deadlines.id))
    .limit(5);

  return { items, today: c.today };
}

export async function recentCases() {
  const c = await getContext();

  return db
    .select({
      id: cases.id,
      caseNumber: cases.caseNumber,
      status: cases.status,
      courtName: cases.courtName,
      clientName: clients.fullName,
      updatedAt: cases.updatedAt,
    })
    .from(cases)
    .innerJoin(clients, clientJoin)
    .where(and(eq(cases.userId, c.userId), isNull(cases.archivedAt)))
    .orderBy(desc(cases.updatedAt), asc(cases.id))
    .limit(5);
}
