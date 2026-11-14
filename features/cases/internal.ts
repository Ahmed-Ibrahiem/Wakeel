import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { cases } from "@/db/schema";

// Same lawyer only: a case id from another account is "not found".
export async function ownsCase(caseId: string, userId: string) {
  const [row] = await db
    .select({ id: cases.id })
    .from(cases)
    .where(and(eq(cases.id, caseId), eq(cases.userId, userId)))
    .limit(1);
  return !!row;
}

// Keeps "recently updated cases" accurate. Always runs in the same db.batch as the change.
export const touchCase = (caseId: string, userId: string) =>
  db
    .update(cases)
    .set({ updatedAt: new Date() })
    .where(and(eq(cases.id, caseId), eq(cases.userId, userId)));