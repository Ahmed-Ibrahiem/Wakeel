// Splits a case's deadlines (nearest first) into three groups.
// `today` is "YYYY-MM-DD" in the lawyer's time zone; ISO dates compare correctly as strings.
export function groupDeadlines<T extends { status: string; dueDate: string }>(
  list: T[],
  today: string,
) {
  const overdue: T[] = []; // pending and the date has passed
  const upcoming: T[] = [];
  const done: T[] = [];

  for (const d of list) {
    if (d.status === "done") done.push(d);
    else if (d.dueDate < today) overdue.push(d);
    else upcoming.push(d);
  }

  done.reverse(); // most recent first
  return { overdue, upcoming, done };
}