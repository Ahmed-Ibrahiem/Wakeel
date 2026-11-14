// Splits a case's hearings (newest first) into three groups.
// Kept outside the component so "now" is computed in a plain function.
export function groupHearings<T extends { status: string; hearingAt: Date }>(
  list: T[],
) {
  const now = Date.now();
  const upcoming: T[] = [];
  const overdue: T[] = []; // still "scheduled" but the time has passed: no decision recorded
  const past: T[] = [];

  for (const h of list) {
    if (h.status === "scheduled") {
      (h.hearingAt.getTime() >= now ? upcoming : overdue).push(h);
    } else {
      past.push(h);
    }
  }

  upcoming.reverse(); // nearest upcoming hearing first
  return { upcoming, overdue, past };
}