import { z } from "zod";

// Only these zones are accepted. An invalid zone name makes Intl throw a RangeError,
// which would break every page that formats a date, so free text is never stored.
export const TIME_ZONES = [
  "Africa/Cairo",
  "Asia/Riyadh",
  "Asia/Dubai",
  "Asia/Kuwait",
  "Asia/Qatar",
  "Asia/Bahrain",
  "Asia/Muscat",
  "Asia/Aden",
  "Asia/Baghdad",
  "Asia/Amman",
  "Asia/Beirut",
  "Asia/Damascus",
  "Africa/Khartoum",
  "Africa/Tripoli",
  "Africa/Tunis",
  "Africa/Algiers",
  "Africa/Casablanca",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "UTC",
] as const;

export const REMINDER_DAYS = ["0", "1", "2", "3", "7"] as const;
export const REMINDER_HOURS = ["0", "1", "2", "3", "6", "12", "24"] as const;

// string -> string, like the other forms. The action converts the numbers.
export const settingsFormSchema = z.object({
  timeZone: z.enum(TIME_ZONES, "المنطقة الزمنية غير صالحة"),
  reminderDays: z.enum(REMINDER_DAYS, "قيمة غير صالحة"),
  reminderHours: z.enum(REMINDER_HOURS, "قيمة غير صالحة"),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;