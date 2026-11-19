// Arabic month names with Latin digits, matching the rest of the app
const LOCALE = "ar-EG-u-nu-latn";

// An instant (created_at, a hearing time) shown as a date in the lawyer's zone
export function formatLongDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(date);
}

// A plain calendar date (yyyy-mm-dd, e.g. a deadline): format it in UTC
// so it never shifts to the previous or next day
export function formatLongDateString(isoDate: string): string {
  return formatLongDate(new Date(`${isoDate}T00:00:00Z`), "UTC");
}

// 12-hour time in the lawyer's zone, e.g. "9:00 ص"
export function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(date);
}
