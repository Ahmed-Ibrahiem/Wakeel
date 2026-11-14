import type { HEARING_STATUSES, HEARING_TYPES } from "./schemas";

export const HEARING_TYPE_LABELS: Record<
  (typeof HEARING_TYPES)[number],
  string
> = {
  pleading: "مرافعة",
  ruling: "نطق بالحكم",
  other: "أخرى",
};

export const HEARING_STATUS_LABELS: Record<
  (typeof HEARING_STATUSES)[number],
  string
> = {
  scheduled: "مجدولة",
  completed: "تمت",
  postponed: "مؤجلة",
};

export const HEARING_STATUS_STYLES: Record<
  (typeof HEARING_STATUSES)[number],
  string
> = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  postponed: "bg-amber-100 text-amber-800",
};
