import "server-only";
import { requireSession } from "@/lib/session";
import { caseIdSchema, caseListParamsSchema } from "./schemas";
import {
  and,
  count,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  or,
  asc,
  sql,
  SQL,
} from "drizzle-orm";
import { cases, clients, deadlines, hearings } from "@/db/schema";
import { db } from "@/db";
import { escapeLike, first, type RawParams } from "@/lib/query-utils";
import * as z from "zod";

// A case is always joined to its client through BOTH id and user_id
const clientJoin = and(
  eq(clients.id, cases.clientId),
  eq(clients.userId, cases.userId),
);

// Only the fields the UI needs: never select the whole row
const caseColumns = {
  id: cases.id,
  clientId: cases.clientId,
  clientName: clients.fullName,
  caseNumber: cases.caseNumber,
  caseType: cases.caseType,
  courtName: cases.courtName,
  status: cases.status,
  judgmentDate: cases.judgmentDate,
  archivedAt: cases.archivedAt,
  updatedAt: cases.updatedAt,
};

// Calculated per case inside the same query (never stored), only for the list.
// Earliest still-scheduled hearing: in the past means it has no decision yet.
const nextHearingAt = sql<Date | null>`
  (select min(${hearings.hearingAt}) from ${hearings}
   where ${hearings.caseId} = ${cases.id}
   and ${hearings.userId} = ${cases.userId}
   and ${hearings.status} = 'scheduled')
`
  .mapWith(hearings.hearingAt)
  .as("next_hearing_at");

// Latest hearing that already has a decision
const lastHearingAt = sql<Date | null>`
  (select max(${hearings.hearingAt}) from ${hearings}
   where ${hearings.caseId} = ${cases.id}
   and ${hearings.userId} = ${cases.userId}
   and ${hearings.status} <> 'scheduled')
`
  .mapWith(hearings.hearingAt)
  .as("last_hearing_at");

// Earliest pending deadline (an overdue one comes first, which is what we want)
const nextDeadlineDate = sql<string | null>`
  (select min(${deadlines.dueDate}) from ${deadlines}
   where ${deadlines.caseId} = ${cases.id}
   and ${deadlines.userId} = ${cases.userId}
   and ${deadlines.status} = 'pending')
`.as("next_deadline_date");

export const casesList = async (raw: RawParams) => {
  const { user } = await requireSession();

  const { q, page, pageSize, status, archived } = caseListParamsSchema.parse({
    q: first(raw.q),
    page: first(raw.page),
    pageSize: first(raw.pageSize),
    status: first(raw.status),
    archived: first(raw.archived),
  });

  const conditions: SQL[] = [
    eq(cases.userId, user.id),
    archived ? isNotNull(cases.archivedAt) : isNull(cases.archivedAt),
  ];

  if (status !== "all") conditions.push(eq(cases.status, status));

  if (q) {
    const like = `%${escapeLike(q)}%`;
    conditions.push(
      or(
        ilike(cases.caseNumber, like),
        ilike(clients.fullName, like),
        ilike(cases.courtName, like),
      )!,
    );
  }

  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: count() })
    .from(cases)
    .innerJoin(clients, clientJoin)
    .where(where);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const items = await db
    .select({ ...caseColumns, nextHearingAt, lastHearingAt, nextDeadlineDate })
    .from(cases)
    .innerJoin(clients, clientJoin)
    .where(where)
    .orderBy(desc(cases.updatedAt), asc(cases.id))
    .limit(pageSize)
    .offset((currentPage - 1) * pageSize);

  return {
    items,
    page: currentPage,
    totalPages,
    pageSize,
    total,
    q,
    status,
    archived,
  };
};

export async function getCase(id: string) {
  const { user } = await requireSession();

  // A malformed uuid would make Postgres throw, so we reject it before the query
  if (!caseIdSchema.safeParse(id).success) return null;

  const [row] = await db
    .select({
      ...caseColumns,
      opposingParty: cases.opposingParty,
      notes: cases.notes,
      createdAt: cases.createdAt,
    })
    .from(cases)
    .innerJoin(clients, clientJoin)
    .where(and(eq(cases.id, id), eq(cases.userId, user.id)))
    .limit(1);

  return row ?? null; // null for "doesn't exist" and "not yours": same result
}

// For the client picker. includeId keeps the case's current client visible even if archived
export async function listClientOptions(includeId?: string) {
  const { user } = await requireSession();

  const visible = includeId
    ? or(isNull(clients.archivedAt), eq(clients.id, includeId))!
    : isNull(clients.archivedAt);

  return db
    .select({
      id: clients.id,
      fullName: clients.fullName,
      phone: clients.phone,
      email: clients.email,
    })
    .from(clients)
    .where(and(eq(clients.userId, user.id), visible))
    .orderBy(asc(clients.fullName))
    .limit(500);
}

// All cases of one client, archived ones last. Capped at 100: a single client
// with more cases than that is far outside normal use.
export async function listClientCases(clientId: string) {
  const { user } = await requireSession();

  // A malformed uuid would make Postgres throw, so we reject it before the query
  if (!z.uuid().safeParse(clientId).success) return [];

  return db
    .select({ ...caseColumns, nextHearingAt, lastHearingAt, nextDeadlineDate })
    .from(cases)
    .innerJoin(clients, clientJoin)
    .where(and(eq(cases.userId, user.id), eq(cases.clientId, clientId)))
    .orderBy(
      sql`${cases.archivedAt} is not null`, // false first: active cases on top
      desc(cases.updatedAt),
      asc(cases.id),
    )
    .limit(100);
}
