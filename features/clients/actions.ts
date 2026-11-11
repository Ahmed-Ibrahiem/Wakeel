"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import * as z from "zod";
import { db } from "@/db";
import { clients, type NewClient } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { checkRateLimits, limitMessage } from "@/lib/rateLimit";
import { E164_RE, toE164 } from "@/lib/phone";
import { getUserSettings } from "@/lib/userSettings";
import { todayIn } from "@/lib/dates";
import { clientFormSchema, type ClientFormValues } from "./schemas";

const fail = (message: string) => ({ success: false as const, message });

// Common rules between addition and modification, and returns data ready for storage
type Prepared =
  | { ok: false; error: string }
  | { ok: true; data: Omit<NewClient, "userId"> };

function prepare(v: ClientFormValues, timezone: string): Prepared {
  if (v.firstContactDate > todayIn(timezone)) {
    return { ok: false, error: "تاريخ أول تعامل لا يمكن أن يكون في المستقبل" };
  }

  let phone: string | null = null;
  if (v.phoneLocal) {
    phone = toE164(v.dialCode, v.phoneLocal);
    if (!E164_RE.test(phone))
      return { ok: false, error: "رقم الهاتف غير صالح" };
  }

  return {
    ok: true,
    data: {
      fullName: v.fullName,
      phone,
      email: v.email ? v.email.toLowerCase() : null,
      address: v.address || null,
      firstContactDate: v.firstContactDate,
    },
  };
}

function pgCode(e: unknown): string | undefined {
  let cur = e as { code?: unknown; cause?: unknown } | undefined;
  for (let i = 0; i < 4 && cur; i++) {
    if (typeof cur.code === "string") return cur.code;
    cur = cur.cause as typeof cur;
  }
  return undefined;
}

export async function createClient(input: unknown) {
  // 1) Who is asking? (from the session, not from the input)
  const { user } = await requireSession();

  // 2) Is the data intact? Any increment field (such as userId) is removed by itself
  const parsed = clientFormSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  // 3) Doesn't he write too much?
  const limit = await checkRateLimits([
    { name: "client-create", id: user.id, max: 100, windowSec: 3600 },
  ]);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  // 4) Rules depending on the lawyer himself (his timing)
  const settings = await getUserSettings(user.id);
  const timezone = settings?.timeZone ?? "UTC";
  const prepared = prepare(parsed.data, timezone);
  if (!prepared.ok) return fail(prepared.error);

  // 5) Writing, and userId from the session
  let id: string;
  try {
    const [row] = await db
      .insert(clients)
      .values({ ...prepared.data, userId: user.id })
      .returning({ id: clients.id });
    id = row.id;
  } catch (e) {
    console.error("createClient failed:", e);
    return fail("تعذّر حفظ العميل، حاول مرة أخرى");
  }

  revalidatePath("/dashboard/clients");
  return { success: true as const, id };
}

export async function updateClient(id: string, input: unknown) {
  const { user } = await requireSession();

  // The id comes from the URL, meaning from the user: a valid uuid is required
  if (!z.uuid().safeParse(id).success) return fail("العميل غير موجود");

  const parsed = clientFormSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  const limit = await checkRateLimits([
    { name: "client-update", id: user.id, max: 300, windowSec: 3600 },
  ]);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  const settings = await getUserSettings(user.id);
  const timezone = settings?.timeZone ?? "UTC";
  const prepared = prepare(parsed.data, timezone);
  if (!prepared.ok) return fail(prepared.error);

  let updated: { id: string } | undefined;
  try {
    [updated] = await db
      .update(clients)
      .set(prepared.data)
      // Ownership in the same UPDATE condition: There is no way to amend another lawyer's client
      .where(and(eq(clients.id, id), eq(clients.userId, user.id)))
      .returning({ id: clients.id });
  } catch (e) {
    console.error("updateClient failed:", e);
    return fail("تعذّر حفظ التعديلات، حاول مرة أخرى");
  }

  // There is no class that has been modified:
  // either the customer is not here, or he is not yours. The response is the same in both cases
  if (!updated) return fail("العميل غير موجود");

  revalidatePath("/dashboard/clients");
  return { success: true as const };
}

export async function archiveClient(id: string) {
  const { user } = await requireSession();
  if (!z.uuid().safeParse(id).success) return fail("العميل غير موجود");

  const limit = await checkRateLimits([
    { name: "client-update", id: user.id, max: 300, windowSec: 3600 },
  ]);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let row: { id: string } | undefined;
  try {
    [row] = await db
      .update(clients)
      // COALESCE: If it was archived before,
      // we will leave the original archiving date (and the process will remain safe if repeated)
      .set({ archivedAt: sql`COALESCE(${clients.archivedAt}, now())` })
      .where(and(eq(clients.id, id), eq(clients.userId, user.id)))
      .returning({ id: clients.id });
  } catch (e) {
    console.error("archiveClient failed:", e);
    return fail("تعذّرت الأرشفة، حاول مرة أخرى");
  }

  if (!row) return fail("العميل غير موجود");

  revalidatePath("/dashboard/clients");
  return { success: true as const };
}

export async function deleteClient(id: string) {
  const { user } = await requireSession();
  if (!z.uuid().safeParse(id).success) return fail("العميل غير موجود");

  const limit = await checkRateLimits([
    { name: "client-update", id: user.id, max: 300, windowSec: 3600 },
  ]);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let row: { id: string } | undefined;
  try {
    [row] = await db
      .delete(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, user.id)))
      .returning({ id: clients.id });
  } catch (e) {
    // 23503 = foreign key violence: The database itself was rejected because the client had issues
    if (pgCode(e) === "23503") {
      return fail("لا يمكن حذف عميل عنده قضايا. أرشفه بدلاً من الحذف.");
    }
    console.error("deleteClient failed:", e);
    return fail("تعذّر حذف العميل، حاول مرة أخرى");
  }

  if (!row) return fail("العميل غير موجود");

  revalidatePath("/dashboard/clients");
  return { success: true as const };
}

export async function restoreClient(id: string) {
  const { user } = await requireSession();
  if (!z.uuid().safeParse(id).success) return fail("العميل غير موجود");

  const limit = await checkRateLimits([
    { name: "client-update", id: user.id, max: 300, windowSec: 3600 },
  ]);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  let row: { id: string } | undefined;
  try {
    [row] = await db
      .update(clients)
      .set({ archivedAt: null })
      .where(and(eq(clients.id, id), eq(clients.userId, user.id)))
      .returning({ id: clients.id });
  } catch (e) {
    console.error("restoreClient failed:", e);
    return fail("تعذّر الاسترجاع، حاول مرة أخرى");
  }

  if (!row) return fail("العميل غير موجود");

  revalidatePath("/dashboard/clients");
  return { success: true as const };
}
