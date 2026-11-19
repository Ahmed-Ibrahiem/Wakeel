import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";

export const CASES_BASE = "/dashboard/cases";

export function casesHref(p: {
  q?: string;
  status?: string;
  archived?: boolean;
  page?: number;
  pageSize?: number;
}) {
  const sp = new URLSearchParams();
  if (p.archived) sp.set("archived", "1");
  if (p.status && p.status !== "all") sp.set("status", p.status);
  if (p.q) sp.set("q", p.q);
  if (p.pageSize && p.pageSize !== DEFAULT_PAGE_SIZE)
    sp.set("pageSize", String(p.pageSize));
  if (p.page && p.page > 1) sp.set("page", String(p.page));
  const qs = sp.toString();
  return qs ? `${CASES_BASE}?${qs}` : CASES_BASE;
}
