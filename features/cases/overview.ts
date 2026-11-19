import { toZonedParts } from "@/lib/zoned-time";
import {
  formatLongDate,
  formatLongDateString,
  formatTime,
} from "@/lib/format-date";
import { HEARING_TYPE_LABELS } from "@/features/hearings/labels";

export type UpcomingItem = {
  id: string;
  sortKey: string;
  dateLabel: string;
  typeLabel: string;
  detail: string | null; // the deadline title
  timeLabel: string | null; // deadlines have a date only
};

type HearingInput = {
  id: string;
  hearingAt: Date;
  type: keyof typeof HEARING_TYPE_LABELS;
};
type DeadlineInput = { id: string; dueDate: string; title: string };

// One list of upcoming hearings and pending deadlines, nearest first
export function buildUpcoming(
  hearings: HearingInput[],
  deadlines: DeadlineInput[],
  timeZone: string,
): UpcomingItem[] {
  const items: UpcomingItem[] = [
    ...hearings.map((h) => {
      const { date, time } = toZonedParts(h.hearingAt, timeZone);
      return {
        id: `h-${h.id}`,
        sortKey: `${date}T${time}`,
        dateLabel: formatLongDate(h.hearingAt, timeZone),
        typeLabel: HEARING_TYPE_LABELS[h.type],
        detail: null,
        timeLabel: formatTime(h.hearingAt, timeZone),
      };
    }),
    ...deadlines.map((d) => ({
      id: `d-${d.id}`,
      sortKey: `${d.dueDate}T00:00`,
      dateLabel: formatLongDateString(d.dueDate),
      typeLabel: "موعد نهائي",
      detail: d.title,
      timeLabel: null,
    })),
  ];

  return items.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
}