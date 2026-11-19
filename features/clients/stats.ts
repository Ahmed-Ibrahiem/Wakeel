type CaseLike = {
  caseNumber: string;
  status: string;
  archivedAt: Date | null;
  updatedAt: Date;
};

// Same rules as the SQL in clientsList: keep them in sync.
// Active = at least one case that is not closed and not archived.
export function getClientStats(cases: CaseLike[]) {
  let ongoing = 0;
  let open = 0;
  let latest: CaseLike | null = null;

  for (const c of cases) {
    if (!c.archivedAt) {
      if (c.status === "ongoing") ongoing++;
      if (c.status !== "closed") open++;
    }
    // The latest case is the most recently updated one, archived included
    if (!latest || c.updatedAt > latest.updatedAt) latest = c;
  }

  return {
    total: cases.length,
    ongoing,
    isActive: open > 0,
    latestCaseNumber: latest?.caseNumber ?? null,
  };
}