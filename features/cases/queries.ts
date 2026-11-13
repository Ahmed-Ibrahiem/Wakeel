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
  SQL,
} from "drizzle-orm";
import { cases, clients } from "@/db/schema";
import { db } from "@/db";

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");

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
    .select(caseColumns)
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
    .select({ id: clients.id, fullName: clients.fullName })
    .from(clients)
    .where(and(eq(clients.userId, user.id), visible))
    .orderBy(asc(clients.fullName))
    .limit(500);
}