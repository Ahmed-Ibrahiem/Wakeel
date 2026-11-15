import { CONFLICT_WINDOW_MINUTES } from "@/features/hearings/queries";

// Ids of hearings that have another one within the conflict window.
// `items` must be sorted by time, earliest first.
export function flagConflicts<T extends { id: string; hearingAt: Date }>(
  items: T[],
) {
  const windowMs = CONFLICT_WINDOW_MINUTES * 60 * 1000;
  const flagged = new Set<string>();

  for (let i = 1; i < items.length; i++) {
    const gap = items[i].hearingAt.getTime() - items[i - 1].hearingAt.getTime();
    if (gap <= windowMs) {
      flagged.add(items[i - 1].id);
      flagged.add(items[i].id);
    }
  }
  return flagged;
}
