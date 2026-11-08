import "server-only";
import { requireSession } from "@/lib/session";
import { clientsListSchema } from "./schemas";
import { and, count, eq, ilike, isNull, or, asc, SQL } from "drizzle-orm";
import { clients } from "@/db/schema";
import { db } from "@/db";

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");

export const clientsList = async (raw: RawParams) => {
  const { user } = await requireSession();

  const { q, page, pageSize } = clientsListSchema.parse({
    q: first(raw.q),
    page: first(raw.page),
    pageSize: first(raw.pageSize),
  });

  const conditions: SQL[] = [
    eq(clients.userId, user.id),
    isNull(clients.archivedAt),
  ];

  if (q) {
    const digits = q.replace(/\D/g, "").replace(/^0+/, "");
    const search: SQL[] = [ilike(clients.fullName, `%${escapeLike(q)}%`)];
    if (digits.length >= 3) search.push(ilike(clients.phone, `%${digits}%`));
    conditions.push(or(...search)!);
  }

  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: count() })
    .from(clients)
    .where(where);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const items = await db
    .select()
    .from(clients)
    .where(where)
    .orderBy(asc(clients.fullName), asc(clients.id))
    .limit(pageSize)
    .offset((currentPage - 1) * pageSize);

  return { items, page: currentPage, totalPages, pageSize, total , q };
};
