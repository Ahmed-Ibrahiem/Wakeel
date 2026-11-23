import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { cases, clients, deadlines, hearings } from "@/db/schema";

// Removes everything the lawyer owns. One batch = one transaction, and the order matters:
// there is no cascade between app tables, so children go before their parents.
export async function deleteAccountData(userId: string) {
  await db.batch([
    db.delete(hearings).where(eq(hearings.userId, userId)),
    db.delete(deadlines).where(eq(deadlines.userId, userId)),
    db.delete(cases).where(eq(cases.userId, userId)),
    db.delete(clients).where(eq(clients.userId, userId)),
  ]);
}