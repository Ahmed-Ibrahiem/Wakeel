import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { deadlines } from "@/db/schema";
import { requireSession } from "@/lib/session"; // same import as hearings/queries.ts
import { caseIdSchema } from "@/features/cases/schemas";
import { deadlineIdSchema } from "./schemas";

const deadlineColumns = {
  id: deadlines.id,
  caseId: deadlines.caseId,
  title: deadlines.title,
  dueDate: deadlines.dueDate,
  status: deadlines.status,
  completedAt: deadlines.completedAt,
  notes: deadlines.notes,
  createdAt: deadlines.createdAt,
  updatedAt: deadlines.updatedAt,
};

// All deadlines of one case, nearest date first. The UI splits overdue / upcoming / done.
export async function listCaseDeadlines(caseId: string) {
  const session = await requireSession();
  if (!caseIdSchema.safeParse(caseId).success) return [];

  return db
    .select(deadlineColumns)
    .from(deadlines)
    .where(
      and(
        eq(deadlines.caseId, caseId),
        eq(deadlines.userId, session.user.id),
      ),
    )
    .orderBy(asc(deadlines.dueDate), asc(deadlines.id))
    .limit(200);
}

export async function getDeadline(id: string) {
  const session = await requireSession();
  if (!deadlineIdSchema.safeParse(id).success) return null;

  const [row] = await db
    .select(deadlineColumns)
    .from(deadlines)
    .where(and(eq(deadlines.id, id), eq(deadlines.userId, session.user.id)))
    .limit(1);
  return row ?? null;
}