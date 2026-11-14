"use server";

import { and, eq, max, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { cases, hearings } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { checkRateLimits, limitMessage } from "@/lib/rateLimit";
import { getUserSettings } from "@/lib/userSettings";
import { zonedToUtc } from "@/lib/zoned-time";
import { caseIdSchema } from "@/features/cases/schemas";
import { findConflicts } from "./queries";
import {
  hearingFormSchema,
  hearingIdSchema,
  hearingOutcomeSchema,
  type HearingFormValues,
  type HearingOutcomeValues,
} from "./schemas";

type Result =
  | { success: true }
  | { success: false; message: string; conflict?: boolean };

const fail = (message: string): Result => ({ success: false, message });
const GENERIC_ERROR = "حصلت مشكلة غير متوقعة. حاول مرة اخري.";

// One hourly bucket per action name and user
const limited = (name: string, userId: string, max: number) =>
  checkRateLimits([{ name, id: userId, max, windowSec: 3600 }]);

const caseNotFound = () => fail("القضية غير موجودة");
const hearingNotFound = () => fail("الجلسة غير موجودة");

// Same lawyer only: a case id from another account is "not found".
async function ownsCase(caseId: string, userId: string) {
  const [row] = await db
    .select({ id: cases.id })
    .from(cases)
    .where(and(eq(cases.id, caseId), eq(cases.userId, userId)))
    .limit(1);
  return !!row;
}

async function getOwnHearing(id: string, userId: string) {
  const [row] = await db
    .select({
      id: hearings.id,
      caseId: hearings.caseId,
      hearingAt: hearings.hearingAt,
      status: hearings.status,
    })
    .from(hearings)
    .where(and(eq(hearings.id, id), eq(hearings.userId, userId)))
    .limit(1);
  return row ?? null;
}

// Keeps "recently updated cases" accurate. Always runs in the same db.batch as the change.
const touchCase = (caseId: string, userId: string) =>
  db
    .update(cases)
    .set({ updatedAt: new Date() })
    .where(and(eq(cases.id, caseId), eq(cases.userId, userId)));

const AFTER_HELD_MESSAGE =
  "الجلسة لابد ان تكون بعد آخر جلسة تم تسجيل لها قرار في هذه القضية";

// Latest hearing of the case that already has a decision (postponed or completed)
async function latestHeldAt(
  caseId: string,
  userId: string,
  excludeId?: string,
) {
  const conditions = [
    eq(hearings.caseId, caseId),
    eq(hearings.userId, userId),
    ne(hearings.status, "scheduled"),
  ];
  if (excludeId) conditions.push(ne(hearings.id, excludeId));

  const [row] = await db
    .select({ at: max(hearings.hearingAt) })
    .from(hearings)
    .where(and(...conditions));
  return row?.at ? new Date(row.at) : null;
}

async function conflictResult(userId: string, at: Date, excludeId?: string) {
  const found = await findConflicts(userId, at, excludeId);
  if (found.length === 0) return null;
  const numbers = [...new Set(found.map((c) => c.caseNumber))].join("، ");
  return {
    success: false as const,
    conflict: true,
    message: `لديك جلسة اخري قريبة من هذا الميعاد (قضية رقم ${numbers}). تأكيد الحفظ؟`,
  };
}

export async function createHearing(
  caseId: string,
  input: HearingFormValues,
  confirmConflict = false,
): Promise<Result> {
  const session = await requireSession(); // outside try/catch on purpose
  const userId = session.user.id;

  if (!caseIdSchema.safeParse(caseId).success) return caseNotFound();
  const parsed = hearingFormSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  const limit = await limited("hearing-create", userId, 200);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  try {
    if (!(await ownsCase(caseId, userId))) return caseNotFound();

    const { timeZone } = await getUserSettings(userId);
    const at = zonedToUtc(
      parsed.data.hearingDate,
      parsed.data.hearingTime,
      timeZone,
    );
    if (!at) return fail("التاريخ أو الوقت غير صالح");

    const latest = await latestHeldAt(caseId, userId);
    if (latest && at.getTime() <= latest.getTime()) {
      return fail(AFTER_HELD_MESSAGE);
    }

    if (!confirmConflict) {
      const conflict = await conflictResult(userId, at);
      if (conflict) return conflict;
    }

    await db.batch([
      db.insert(hearings).values({
        userId,
        caseId,
        hearingAt: at,
        type: parsed.data.type,
        location: parsed.data.location || null,
        notes: parsed.data.notes || null,
      }),
      touchCase(caseId, userId),
    ]);
  } catch (error) {
    console.error("createHearing failed", error);
    return fail(GENERIC_ERROR);
  }

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}

export async function updateHearing(
  id: string,
  input: HearingFormValues,
  confirmConflict = false,
): Promise<Result> {
  const session = await requireSession();
  const userId = session.user.id;

  if (!hearingIdSchema.safeParse(id).success) return hearingNotFound();
  const parsed = hearingFormSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  const limit = await limited("hearing-update", userId, 400);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let caseId: string;
  try {
    const existing = await getOwnHearing(id, userId);
    if (!existing) return hearingNotFound();
    caseId = existing.caseId;

    if (existing.status !== "scheduled") {
      return fail("لا نستطيع تعديل جلسة تم تسجيل لها قرار بالفعل");
    }

    const { timeZone } = await getUserSettings(userId);
    const at = zonedToUtc(
      parsed.data.hearingDate,
      parsed.data.hearingTime,
      timeZone,
    );
    if (!at) return fail("التاريخ أو الوقت غير صالح");

    const latest = await latestHeldAt(caseId, userId, id);
    if (latest && at.getTime() <= latest.getTime()) {
      return fail(AFTER_HELD_MESSAGE);
    }

    const timeChanged = at.getTime() !== existing.hearingAt.getTime();

    if (timeChanged && !confirmConflict) {
      const conflict = await conflictResult(userId, at, id);
      if (conflict) return conflict;
    }

    const [updated] = await db.batch([
      db
        .update(hearings)
        .set({
          hearingAt: at,
          type: parsed.data.type,
          location: parsed.data.location || null,
          notes: parsed.data.notes || null,
          updatedAt: new Date(),
          // A reminder already sent for the old time must not block the new one
          ...(timeChanged
            ? { reminderDaySentAt: null, reminderHoursSentAt: null }
            : {}),
        })
        .where(and(eq(hearings.id, id), eq(hearings.userId, userId)))
        .returning({ id: hearings.id }),
      touchCase(caseId, userId),
    ]);
    if (updated.length === 0) return hearingNotFound();
  } catch (error) {
    console.error("updateHearing failed", error);
    return fail(GENERIC_ERROR);
  }

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}

export async function deleteHearing(id: string): Promise<Result> {
  const session = await requireSession();
  const userId = session.user.id;

  if (!hearingIdSchema.safeParse(id).success) return hearingNotFound();

  const limit = await limited("hearing-update", userId, 400);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let caseId: string;
  try {
    const existing = await getOwnHearing(id, userId);
    if (!existing) return hearingNotFound();
    caseId = existing.caseId;

    const [deleted] = await db.batch([
      db
        .delete(hearings)
        .where(and(eq(hearings.id, id), eq(hearings.userId, userId)))
        .returning({ id: hearings.id }),
      touchCase(caseId, userId),
    ]);
    if (deleted.length === 0) return hearingNotFound();
  } catch (error) {
    console.error("deleteHearing failed", error);
    return fail(GENERIC_ERROR);
  }

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}

// Records the decision and (optionally) schedules the next hearing in ONE atomic batch.
// With a next date: old hearing -> postponed, new one -> scheduled.
// Without it: old hearing -> completed.
export async function recordHearingOutcome(
  id: string,
  input: HearingOutcomeValues,
  confirmConflict = false,
): Promise<Result> {
  const session = await requireSession();
  const userId = session.user.id;

  if (!hearingIdSchema.safeParse(id).success) return hearingNotFound();
  const parsed = hearingOutcomeSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  const limit = await limited("hearing-update", userId, 400);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let caseId: string;
  try {
    const existing = await getOwnHearing(id, userId);
    if (!existing) return hearingNotFound();
    if (existing.status !== "scheduled") {
      return fail("هذه الجلسة تم تسجيل لها قرار سابقا بالفعل");
    }
    caseId = existing.caseId;

    const { nextDate, nextTime, nextType, outcome } = parsed.data;
    let nextAt: Date | null = null;

    if (nextDate && nextTime) {
      const { timeZone } = await getUserSettings(userId);
      nextAt = zonedToUtc(nextDate, nextTime, timeZone);
      if (!nextAt) return fail("تاريخ أو وقت الجلسة القادمة غير صالح");
      if (nextAt.getTime() <= existing.hearingAt.getTime()) {
        return fail("الجلسة القادمة لابد ان تكون بعد الجلسة الحالية");
      }
      if (!confirmConflict) {
        const conflict = await conflictResult(userId, nextAt, id);
        if (conflict) return conflict;
      }
    }

    const closeCurrent = db
      .update(hearings)
      .set({
        status: nextAt ? "postponed" : "completed",
        outcome,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(hearings.id, id),
          eq(hearings.userId, userId),
          eq(hearings.status, "scheduled"),
        ),
      );

    if (nextAt) {
      await db.batch([
        closeCurrent,
        db.insert(hearings).values({
          userId,
          caseId,
          hearingAt: nextAt,
          type: nextType,
        }),
        touchCase(caseId, userId),
      ]);
    } else {
      await db.batch([closeCurrent, touchCase(caseId, userId)]);
    }
  } catch (error) {
    console.error("recordHearingOutcome failed", error);
    return fail(GENERIC_ERROR);
  }

  revalidatePath(`/dashboard/cases/${caseId}`);
  return { success: true };
}
