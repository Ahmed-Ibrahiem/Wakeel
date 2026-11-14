import { and, asc, desc, eq, gte, lte, ne } from "drizzle-orm";
import { db } from "@/db";
import { cases, hearings } from "@/db/schema";
import { requireSession } from "@/lib/session"; // copy from cases/queries.ts
import { caseIdSchema } from "@/features/cases/schemas";
import { hearingIdSchema } from "./schemas";

export type Hearing = typeof hearings.$inferSelect;

// Hearings closer than this to a new one are reported as a possible double booking
export const CONFLICT_WINDOW_MINUTES = 90;

const hearingColumns = {
  id: hearings.id,
  caseId: hearings.caseId,
  hearingAt: hearings.hearingAt,
  type: hearings.type,
  status: hearings.status,
  location: hearings.location,
  outcome: hearings.outcome,
  notes: hearings.notes,
  createdAt: hearings.createdAt,
  updatedAt: hearings.updatedAt,
};

// All hearings of one case, newest first. The UI splits upcoming from past.
export async function listCaseHearings(caseId: string) {
  const session = await requireSession();
  if (!caseIdSchema.safeParse(caseId).success) return [];

  return db
    .select(hearingColumns)
    .from(hearings)
    .where(
      and(eq(hearings.caseId, caseId), eq(hearings.userId, session.user.id)),
    )
    .orderBy(desc(hearings.hearingAt), asc(hearings.id))
    .limit(200);
}

export async function getHearing(id: string) {
  const session = await requireSession();
  if (!hearingIdSchema.safeParse(id).success) return null;

  const [row] = await db
    .select(hearingColumns)
    .from(hearings)
    .where(and(eq(hearings.id, id), eq(hearings.userId, session.user.id)))
    .limit(1);
  return row ?? null;
}

// Internal helper for actions (takes userId from the action's session, never from the client).
// Other scheduled hearings of the same lawyer within the window around `at`.
export async function findConflicts(
  userId: string,
  at: Date,
  excludeId?: string,
) {
  const windowMs = CONFLICT_WINDOW_MINUTES * 60 * 1000;
  const conditions = [
    eq(hearings.userId, userId),
    eq(hearings.status, "scheduled"),
    gte(hearings.hearingAt, new Date(at.getTime() - windowMs)),
    lte(hearings.hearingAt, new Date(at.getTime() + windowMs)),
  ];
  if (excludeId) conditions.push(ne(hearings.id, excludeId));

  return db
    .select({
      id: hearings.id,
      hearingAt: hearings.hearingAt,
      caseNumber: cases.caseNumber,
    })
    .from(hearings)
    .innerJoin(
      cases,
      and(eq(cases.id, hearings.caseId), eq(cases.userId, hearings.userId)),
    )
    .where(and(...conditions))
    .limit(5);
}