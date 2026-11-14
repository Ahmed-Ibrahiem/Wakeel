import type { DEADLINE_STATUSES } from "./schemas";

export const DEADLINE_STATUS_LABELS: Record<
  (typeof DEADLINE_STATUSES)[number],
  string
> = {
  pending: "معلّق",
  done: "تم",
};

export const DEADLINE_STATUS_STYLES: Record<
  (typeof DEADLINE_STATUSES)[number],
  string
> = {
  pending: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
};