"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { deadlines } from "@/db/schema";
import { requireSession } from "@/lib/session"; // same imports as hearings/actions.ts
import { limitMessage, limitedPerHour } from "@/lib/rateLimit";
import { caseIdSchema } from "@/features/cases/schemas";
import {
  deadlineFormSchema,
  deadlineIdSchema,
  type DeadlineFormValues,
} from "./schemas";
import { fail, GENERIC_ERROR } from "@/lib/action-result";
import { ownsCase, touchCase } from "@/features/cases/internal";

type Result = { success: true } | { success: false; message: string };

const caseNotFound = () => fail("القضية غير موجودة");
const deadlineNotFound = () => fail("الموعد غير موجود");

async function getOwnDeadline(id: string, userId: string) {
  const [row] = await db
    .select({
      id: deadlines.id,
      caseId: deadlines.caseId,
      dueDate: deadlines.dueDate,
      status: deadlines.status,
    })
    .from(deadlines)
    .where(and(eq(deadlines.id, id), eq(deadlines.userId, userId)))
    .limit(1);
  return row ?? null;
}

export async function createDeadline(
  caseId: string,
  input: DeadlineFormValues,
): Promise<Result> {
  const session = await requireSession(); // outside try/catch on purpose
  const userId = session.user.id;

  if (!caseIdSchema.safeParse(caseId).success) return caseNotFound();
  const parsed = deadlineFormSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  const limit = await limitedPerHour("deadline-create", userId, 200);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  try {
    if (!(await ownsCase(caseId, userId))) return caseNotFound();

    await db.batch([
      db.insert(deadlines).values({
        userId,
        caseId,
        title: parsed.data.title,
        dueDate: parsed.data.dueDate,
        notes: parsed.data.notes || null,
      }),
      touchCase(caseId, userId),
    ]);
  } catch (error) {
    console.error("createDeadline failed", error);
    return fail(GENERIC_ERROR);
  }

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}

export async function updateDeadline(
  id: string,
  input: DeadlineFormValues,
): Promise<Result> {
  const session = await requireSession();
  const userId = session.user.id;

  if (!deadlineIdSchema.safeParse(id).success) return deadlineNotFound();
  const parsed = deadlineFormSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  const limit = await limitedPerHour("deadline-update", userId, 400);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let caseId: string;
  try {
    const existing = await getOwnDeadline(id, userId);
    if (!existing) return deadlineNotFound();
    if (existing.status !== "pending") {
      return fail("لابد ان يكون الموعد في وضع (معلق) اولاً لكي يمكنك تعديله ");
    }
    caseId = existing.caseId;

    const dateChanged = parsed.data.dueDate !== existing.dueDate;

    const [updated] = await db.batch([
      db
        .update(deadlines)
        .set({
          title: parsed.data.title,
          dueDate: parsed.data.dueDate,
          notes: parsed.data.notes || null,
          updatedAt: new Date(),
          // A reminder already sent for the old date must not block the new one
          ...(dateChanged ? { reminderSentAt: null } : {}),
        })
        .where(and(eq(deadlines.id, id), eq(deadlines.userId, userId)))
        .returning({ id: deadlines.id }),
      touchCase(caseId, userId),
    ]);
    if (updated.length === 0) return deadlineNotFound();
  } catch (error) {
    console.error("updateDeadline failed", error);
    return fail(GENERIC_ERROR);
  }

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}

export async function deleteDeadline(id: string): Promise<Result> {
  const session = await requireSession();
  const userId = session.user.id;

  if (!deadlineIdSchema.safeParse(id).success) return deadlineNotFound();

  const limit = await limitedPerHour("deadline-update", userId, 400);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let caseId: string;
  try {
    const existing = await getOwnDeadline(id, userId);
    if (!existing) return deadlineNotFound();
    caseId = existing.caseId;

    const [deleted] = await db.batch([
      db
        .delete(deadlines)
        .where(and(eq(deadlines.id, id), eq(deadlines.userId, userId)))
        .returning({ id: deadlines.id }),
      touchCase(caseId, userId),
    ]);
    if (deleted.length === 0) return deadlineNotFound();
  } catch (error) {
    console.error("deleteDeadline failed", error);
    return fail(GENERIC_ERROR);
  }

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}

// pending -> done (sets completed_at) or done -> pending (clears it)
async function setDone(id: string, done: boolean): Promise<Result> {
  const session = await requireSession();
  const userId = session.user.id;

  if (!deadlineIdSchema.safeParse(id).success) return deadlineNotFound();

  const limit = await limitedPerHour("deadline-update", userId, 400);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let caseId: string;
  try {
    const existing = await getOwnDeadline(id, userId);
    if (!existing) return deadlineNotFound();
    caseId = existing.caseId;

    const [updated] = await db.batch([
      db
        .update(deadlines)
        .set({
          status: done ? "done" : "pending",
          completedAt: done ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(deadlines.id, id),
            eq(deadlines.userId, userId),
            // Only the opposite state can be changed, so a double click does nothing
            eq(deadlines.status, done ? "pending" : "done"),
          ),
        )
        .returning({ id: deadlines.id }),
      touchCase(caseId, userId),
    ]);
    if (updated.length === 0) {
      return fail(
        done ? "هذا الموعد تم الإنتهاء منه بالفعل" : "هذا الموعد معلّق بالفعل",
      );
    }
  } catch (error) {
    console.error("setDeadlineDone failed", error);
    return fail(GENERIC_ERROR);
  }

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}

export const markDeadlineDone = async (id: string) => setDone(id, true);
export const reopenDeadline = async (id: string) => setDone(id, false);
