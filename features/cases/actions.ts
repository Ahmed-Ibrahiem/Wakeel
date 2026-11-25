"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql, ne } from "drizzle-orm";
import { db } from "@/db";
import { cases, clients } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { checkRateLimits, limitMessage } from "@/lib/rateLimit";
import { caseFormSchema, caseIdSchema, CaseFormValues } from "./schemas";
import { fail } from "@/lib/action-result";
import { pgCode } from "@/lib/pg-error";

// "" becomes null, ready for storage (userId is added by the action)
function prepare(v: CaseFormValues) {
  return {
    clientId: v.clientId,
    caseNumber: v.caseNumber,
    caseType: v.caseType,
    courtName: v.courtName,
    opposingParty: v.opposingParty || null,
    status: v.status,
    judgmentDate: v.judgmentDate || null,
    notes: v.notes || null,
  };
}

// Is there another case of this lawyer with the same number? (excludeId: skip the case being edited)
async function numberExists(
  caseNumber: string,
  userId: string,
  excludeId?: string,
) {
  const conditions = [
    eq(cases.userId, userId),
    eq(cases.caseNumber, caseNumber),
  ];
  if (excludeId) conditions.push(ne(cases.id, excludeId));
  const [row] = await db
    .select({ id: cases.id })
    .from(cases)
    .where(and(...conditions))
    .limit(1);
  return !!row;
}
const DUPLICATE = "duplicate" as const;

const NOT_FOUND = "القضية غير موجودة";

// The chosen client must belong to this lawyer (the composite FK enforces it too)
async function ownsClient(clientId: string, userId: string) {
  const [row] = await db
    .select({ id: clients.id })
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)))
    .limit(1);
  return !!row;
}

export async function createCase(input: unknown, confirmDuplicate = false) {
  // 1) Who is asking? (from the session, not from the input)
  const { user } = await requireSession();

  // 2) Is the data intact? Extra keys (such as userId) are stripped by Zod
  const parsed = caseFormSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  // 3) Rate limit
  const limit = await checkRateLimits([
    { name: "case-create", id: user.id, max: 100, windowSec: 3600 },
  ]);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  const data = prepare(parsed.data);

  // 4) Rules depending on the lawyer: the client must be his
  // 5) Write, with userId from the session
  let id: string;
  try {
    if (!(await ownsClient(parsed.data.clientId, user.id))) {
      return fail("العميل غير موجود");
    }

    if (!confirmDuplicate && (await numberExists(data.caseNumber, user.id))) {
      return {
        success: false as const,
        message: "فيه قضية بنفس الرقم",
        [DUPLICATE]: true as const,
      };
    }

    const [row] = await db
      .insert(cases)
      .values({ ...data, userId: user.id })
      .returning({ id: cases.id });
    id = row.id;
  } catch (e) {
    console.error("createCase failed:", e);
    return fail("تعذّر حفظ القضية، حاول مرة أخرى");
  }

  revalidatePath("/dashboard/cases");
  return { success: true as const, id };
}

export async function updateCase(
  id: string,
  input: unknown,
  confirmDuplicate = false,
) {
  const { user } = await requireSession();

  if (!caseIdSchema.safeParse(id).success) return fail(NOT_FOUND);

  const parsed = caseFormSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  const data = prepare(parsed.data);

  const limit = await checkRateLimits([
    { name: "case-update", id: user.id, max: 300, windowSec: 3600 },
  ]);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let updated: { id: string } | undefined;
  try {
    if (!(await ownsClient(parsed.data.clientId, user.id))) {
      return fail("العميل غير موجود");
    }

    if (
      !confirmDuplicate &&
      (await numberExists(data.caseNumber, user.id, id))
    ) {
      return {
        success: false as const,
        message: "فيه قضية بنفس الرقم",
        [DUPLICATE]: true as const,
      };
    }

    [updated] = await db
      .update(cases)
      .set(data) // id and userId are never in the SET
      // Ownership in the same UPDATE condition
      .where(and(eq(cases.id, id), eq(cases.userId, user.id)))
      .returning({ id: cases.id });
  } catch (e) {
    console.error("updateCase failed:", e);
    return fail("تعذّر حفظ التعديلات، حاول مرة أخرى");
  }

  // Either it doesn't exist or it isn't yours: same answer
  if (!updated) return fail(NOT_FOUND);

  revalidatePath("/dashboard/cases");
  revalidatePath(`/dashboard/cases/${id}`);
  return { success: true as const };
}

export async function archiveCase(id: string) {
  const { user } = await requireSession();
  if (!caseIdSchema.safeParse(id).success) return fail(NOT_FOUND);

  const limit = await checkRateLimits([
    { name: "case-update", id: user.id, max: 300, windowSec: 3600 },
  ]);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let row: { id: string } | undefined;
  try {
    [row] = await db
      .update(cases)
      // COALESCE keeps the original archive date if it was already archived
      .set({ archivedAt: sql`COALESCE(${cases.archivedAt}, now())` })
      .where(and(eq(cases.id, id), eq(cases.userId, user.id)))
      .returning({ id: cases.id });
  } catch (e) {
    console.error("archiveCase failed:", e);
    return fail("تعذّرت الأرشفة، حاول مرة أخرى");
  }

  if (!row) return fail(NOT_FOUND);

  revalidatePath("/dashboard/cases");
  revalidatePath(`/dashboard/cases/${id}`);
  return { success: true as const };
}

export async function restoreCase(id: string) {
  const { user } = await requireSession();
  if (!caseIdSchema.safeParse(id).success) return fail(NOT_FOUND);

  const limit = await checkRateLimits([
    { name: "case-update", id: user.id, max: 300, windowSec: 3600 },
  ]);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let row: { id: string } | undefined;
  try {
    [row] = await db
      .update(cases)
      .set({ archivedAt: null })
      .where(and(eq(cases.id, id), eq(cases.userId, user.id)))
      .returning({ id: cases.id });
  } catch (e) {
    console.error("restoreCase failed:", e);
    return fail("تعذّر الاسترجاع، حاول مرة أخرى");
  }

  if (!row) return fail(NOT_FOUND);

  revalidatePath("/dashboard/cases");
  revalidatePath(`/dashboard/cases/${id}`);
  return { success: true as const };
}

export async function deleteCase(id: string) {
  const { user } = await requireSession();
  if (!caseIdSchema.safeParse(id).success) return fail(NOT_FOUND);

  const limit = await checkRateLimits([
    { name: "case-update", id: user.id, max: 300, windowSec: 3600 },
  ]);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let row: { id: string } | undefined;
  try {
    [row] = await db
      .delete(cases)
      .where(and(eq(cases.id, id), eq(cases.userId, user.id)))
      .returning({ id: cases.id });
  } catch (e) {
    // 23503 = foreign key violation: the case has hearings or deadlines
    if (pgCode(e) === "23503") {
      return fail(
        "لا يمكن حذف قضية ليها جلسات أو مواعيد. أرشفها بدلاً من الحذف.",
      );
    }
    console.error("deleteCase failed:", e);
    return fail("تعذّر حذف القضية، حاول مرة أخرى");
  }

  if (!row) return fail(NOT_FOUND);

  revalidatePath("/dashboard/cases");
  return { success: true as const };
}
