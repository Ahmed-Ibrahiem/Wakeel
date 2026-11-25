import "server-only";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { db } from "@/db";
import {
  account,
  cases,
  clients,
  deadlines,
  hearings,
  user as userTable,
  userSettings,
} from "@/db/schema";
import { todayIn } from "@/lib/dates";
import { zonedToUtc } from "@/lib/zoned-time";
import { DEMO_EMAIL, DEMO_USER_ID } from "./constants";

const TZ = "Africa/Cairo";

function addDays(date: string, n: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

// A hearing at a clock time on a day relative to today, in the demo lawyer's zone
function at(today: string, offset: number, time: string) {
  const d = zonedToUtc(addDays(today, offset), time, TZ);
  if (!d) throw new Error(`Invalid demo time: ${offset} ${time}`);
  return d;
}

// Creates the demo user if it is missing. It is inserted directly (no verification email),
// and the password and time zone are reset on every entry, so nothing can lock it out.
export async function ensureDemoUser(password: string) {
  await db
    .insert(userTable)
    .values({
      id: DEMO_USER_ID,
      name: "المحامي التجريبي",
      email: DEMO_EMAIL,
      emailVerified: true,
    })
    .onConflictDoNothing();

  await db
    .insert(userSettings)
    .values({ userId: DEMO_USER_ID, timeZone: TZ })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: { timeZone: TZ, reminderDaysBefore: 1, reminderHoursBefore: 3 },
    });

  const hash = await hashPassword(password);
  const [existing] = await db
    .select({ id: account.id })
    .from(account)
    .where(
      and(
        eq(account.userId, DEMO_USER_ID),
        eq(account.providerId, "credential"),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .update(account)
      .set({ password: hash, updatedAt: new Date() })
      .where(eq(account.id, existing.id));
  } else {
    await db.insert(account).values({
      id: randomUUID(),
      accountId: DEMO_USER_ID,
      providerId: "credential",
      userId: DEMO_USER_ID,
      password: hash,
      updatedAt: new Date(),
    });
  }
}

function buildDemoData() {
  const userId = DEMO_USER_ID;
  const today = todayIn(TZ);
  const id = () => randomUUID();

  const cl = {
    ahmed: id(), mona: id(), nile: id(), khaled: id(), heba: id(),
    hassan: id(), sara: id(), mostafa: id(), nourhan: id(), omar: id(),
  };

  const clientRows = [
    { id: cl.ahmed, fullName: "أحمد محمود السيد", phone: "+201000000001", email: "ahmed.demo@example.com", address: "مدينة نصر، القاهرة", first: -420 },
    { id: cl.mona, fullName: "منى عبد الرحمن", phone: "+201000000002", email: null, address: "المعادي، القاهرة", first: -300 },
    { id: cl.nile, fullName: "شركة النيل للمقاولات", phone: "+201000000003", email: "legal.demo@example.com", address: "الدقي، الجيزة", first: -520 },
    { id: cl.khaled, fullName: "خالد إبراهيم يوسف", phone: "+201000000004", email: null, address: null, first: -120 },
    { id: cl.heba, fullName: "هبة سمير فؤاد", phone: "+201000000005", email: "heba.demo@example.com", address: "سموحة، الإسكندرية", first: -200 },
    { id: cl.hassan, fullName: "محمد حسن الشناوي", phone: "+201000000006", email: null, address: "6 أكتوبر، الجيزة", first: -700 },
    { id: cl.sara, fullName: "سارة عادل منصور", phone: "+201000000007", email: null, address: "التجمع الخامس، القاهرة", first: -90 },
    { id: cl.mostafa, fullName: "مصطفى كمال عيسى", phone: null, email: null, address: null, first: -650 },
    { id: cl.nourhan, fullName: "نورهان أشرف طه", phone: "+201000000009", email: "nourhan.demo@example.com", address: "مصر الجديدة، القاهرة", first: -60 },
    { id: cl.omar, fullName: "عمر فاروق حسني", phone: "+201000000010", email: null, address: null, first: -900, archived: true },
  ].map(({ first, archived, ...c }) => ({
    ...c,
    userId,
    firstContactDate: addDays(today, first),
    archivedAt: archived ? daysAgo(30) : null,
  }));

  const cs = {
    a: id(), b: id(), c: id(), d: id(), e: id(), f: id(), g: id(),
    h: id(), i: id(), j: id(), k: id(), l: id(), m: id(),
  };

  type CaseSeed = {
    id: string; clientId: string; caseNumber: string;
    caseType: "civil" | "criminal" | "commercial" | "family" | "labor" | "other";
    courtName: string; opposingParty: string | null;
    status: "ongoing" | "postponed" | "closed";
    judgmentOffset?: number; notes?: string; archived?: boolean; updatedDaysAgo: number;
  };

  const caseSeeds: CaseSeed[] = [
    { id: cs.a, clientId: cl.ahmed, caseNumber: "2025/1842", caseType: "civil", courtName: "محكمة القاهرة الجديدة الابتدائية", opposingParty: "شركة الأمل للتطوير العقاري", status: "ongoing", notes: "دعوى مطالبة بتعويض عن تأخر التسليم. المستندات كاملة لدى الموكل.", updatedDaysAgo: 1 },
    { id: cs.b, clientId: cl.ahmed, caseNumber: "2024/731", caseType: "commercial", courtName: "محكمة الاستئناف الاقتصادية", opposingParty: "شركة المدار للتجارة", status: "ongoing", updatedDaysAgo: 3 },
    { id: cs.c, clientId: cl.mona, caseNumber: "2025/2210", caseType: "family", courtName: "محكمة الأسرة بمدينة نصر", opposingParty: "طارق ع.", status: "ongoing", notes: "المطلوب تقديم شهادات الدخل قبل الجلسة القادمة.", updatedDaysAgo: 2 },
    { id: cs.d, clientId: cl.nile, caseNumber: "2025/905", caseType: "commercial", courtName: "المحكمة الاقتصادية بالقاهرة", opposingParty: "شركة الصفوة للتوريدات", status: "ongoing", updatedDaysAgo: 0 },
    { id: cs.e, clientId: cl.nile, caseNumber: "2024/3318", caseType: "labor", courtName: "محكمة شمال القاهرة الابتدائية", opposingParty: "أحد العاملين السابقين", status: "postponed", updatedDaysAgo: 6 },
    { id: cs.f, clientId: cl.khaled, caseNumber: "2025/4471", caseType: "criminal", courtName: "محكمة جنح الجيزة", opposingParty: null, status: "ongoing", updatedDaysAgo: 4 },
    { id: cs.g, clientId: cl.heba, caseNumber: "2025/1190", caseType: "civil", courtName: "محكمة الإسكندرية الابتدائية", opposingParty: "ورثة المرحوم م. س.", status: "postponed", updatedDaysAgo: 8 },
    { id: cs.h, clientId: cl.hassan, caseNumber: "2023/6204", caseType: "civil", courtName: "محكمة الجيزة الابتدائية", opposingParty: "شركة الريف للمقاولات", status: "closed", judgmentOffset: -60, updatedDaysAgo: 60 },
    { id: cs.i, clientId: cl.sara, caseNumber: "2025/3052", caseType: "labor", courtName: "محكمة جنوب القاهرة الابتدائية", opposingParty: "شركة السلام للخدمات", status: "ongoing", updatedDaysAgo: 15 },
    { id: cs.j, clientId: cl.mostafa, caseNumber: "2023/1477", caseType: "family", courtName: "محكمة الأسرة بالتجمع", opposingParty: null, status: "closed", judgmentOffset: -200, updatedDaysAgo: 200 },
    { id: cs.k, clientId: cl.nourhan, caseNumber: "2025/2788", caseType: "other", courtName: "محكمة القضاء الإداري", opposingParty: "الجهة الإدارية", status: "ongoing", updatedDaysAgo: 5 },
    { id: cs.l, clientId: cl.mona, caseNumber: "2025/2951", caseType: "civil", courtName: "محكمة عابدين الجزئية", opposingParty: null, status: "ongoing", updatedDaysAgo: 0 },
    { id: cs.m, clientId: cl.omar, caseNumber: "2022/512", caseType: "criminal", courtName: "محكمة جنايات القاهرة", opposingParty: null, status: "closed", judgmentOffset: -400, archived: true, updatedDaysAgo: 400 },
  ];

  const caseRows = caseSeeds.map((c) => ({
    id: c.id,
    userId,
    clientId: c.clientId,
    caseNumber: c.caseNumber,
    caseType: c.caseType,
    courtName: c.courtName,
    opposingParty: c.opposingParty,
    status: c.status,
    judgmentDate: c.judgmentOffset === undefined ? null : addDays(today, c.judgmentOffset),
    notes: c.notes ?? null,
    archivedAt: c.archived ? daysAgo(30) : null,
    createdAt: daysAgo(c.updatedDaysAgo + 30),
    updatedAt: daysAgo(c.updatedDaysAgo),
  }));

  type H = [string, number | Date, string, "scheduled" | "completed" | "postponed", "pleading" | "ruling" | "other", string?];
  // A hearing "later today" starts two hours from now, so it is still ahead when the demo opens
  const laterToday = new Date(Math.ceil((Date.now() + 2 * 3600_000) / 900_000) * 900_000);

  const hearingSeeds: H[] = [
    [cs.a, -45, "10:00", "postponed", "pleading", "تأجيل لإعلان المدعى عليه"],
    [cs.a, -20, "10:00", "postponed", "pleading", "تأجيل لحضور الخبير"],
    [cs.a, 1, "11:00", "scheduled", "pleading"],
    [cs.b, -30, "10:00", "completed", "pleading", "حجز الدعوى للحكم"],
    [cs.b, 14, "10:00", "scheduled", "ruling"],
    [cs.c, -14, "09:30", "postponed", "pleading", "تأجيل لتقديم المستندات"],
    [cs.c, 5, "09:30", "scheduled", "pleading"],
    [cs.d, -25, "11:00", "postponed", "pleading", "تأجيل للاطلاع"],
    [cs.d, 3, "12:00", "scheduled", "pleading"],
    [cs.e, -40, "10:00", "postponed", "pleading", "تأجيل للتحقيق"],
    [cs.e, 9, "09:30", "scheduled", "pleading"],
    [cs.f, -10, "10:00", "postponed", "pleading", "تأجيل لسماع الشهود"],
    [cs.f, 1, "12:00", "scheduled", "pleading"],
    [cs.g, -35, "10:00", "postponed", "pleading", "تأجيل للرد"],
    [cs.g, -1, "10:00", "scheduled", "pleading"],
    [cs.h, -61, "10:00", "completed", "ruling", "الحكم بالطلبات"],
    [cs.i, -15, "10:00", "completed", "pleading", "حجز الدعوى للحكم"],
    [cs.j, -201, "10:00", "completed", "ruling", "الحكم برفض الدعوى"],
    [cs.k, -18, "10:00", "postponed", "pleading", "تأجيل لتقديم المذكرات"],
    [cs.k, 6, "10:00", "scheduled", "pleading"],
    [cs.l, -12, "10:00", "postponed", "pleading", "تأجيل للمرافعة"],
    [cs.l, laterToday, "", "scheduled", "pleading"],
    [cs.m, -401, "10:00", "completed", "ruling", "الحكم بالبراءة"],
  ];

  const hearingRows = hearingSeeds.map(([caseId, when, time, status, type, outcome]) => ({
    userId,
    caseId,
    hearingAt: when instanceof Date ? when : at(today, when, time),
    status,
    type,
    outcome: outcome ?? null,
  }));

  const deadlineRows = [
    { caseId: cs.a, title: "تقديم مذكرة بالدفاع", due: 2 },
    { caseId: cs.b, title: "ميعاد الطعن بالاستئناف", due: 25 },
    { caseId: cs.d, title: "سداد الرسوم القضائية", due: -3 },
    { caseId: cs.f, title: "تقديم حافظة المستندات", due: 8 },
    { caseId: cs.e, title: "الرد على تقرير الخبير", due: 12 },
    { caseId: cs.h, title: "إيداع صحيفة الاستئناف", due: -55, done: true },
  ].map((d) => ({
    userId,
    caseId: d.caseId,
    title: d.title,
    dueDate: addDays(today, d.due),
    status: d.done ? ("done" as const) : ("pending" as const),
    completedAt: d.done ? daysAgo(50) : null,
  }));

  return { clientRows, caseRows, hearingRows, deadlineRows };
}

// Wipes the demo lawyer's data and plants fresh data relative to today. One batch = one
// transaction, so a failure leaves the previous data untouched. Children are deleted first.
export async function resetDemoData() {
  const { clientRows, caseRows, hearingRows, deadlineRows } = buildDemoData();

  await db.batch([
    db.delete(hearings).where(eq(hearings.userId, DEMO_USER_ID)),
    db.delete(deadlines).where(eq(deadlines.userId, DEMO_USER_ID)),
    db.delete(cases).where(eq(cases.userId, DEMO_USER_ID)),
    db.delete(clients).where(eq(clients.userId, DEMO_USER_ID)),
    db.insert(clients).values(clientRows),
    db.insert(cases).values(caseRows),
    db.insert(hearings).values(hearingRows),
    db.insert(deadlines).values(deadlineRows),
  ]);
}