import type { REMINDER_DAYS, REMINDER_HOURS, TIME_ZONES } from "./schemas";

export const TIME_ZONE_LABELS: Record<(typeof TIME_ZONES)[number], string> = {
  "Africa/Cairo": "القاهرة (مصر)",
  "Asia/Riyadh": "الرياض (السعودية)",
  "Asia/Dubai": "دبي (الإمارات)",
  "Asia/Kuwait": "الكويت",
  "Asia/Qatar": "الدوحة (قطر)",
  "Asia/Bahrain": "المنامة (البحرين)",
  "Asia/Muscat": "مسقط (عُمان)",
  "Asia/Aden": "عدن (اليمن)",
  "Asia/Baghdad": "بغداد (العراق)",
  "Asia/Amman": "عمّان (الأردن)",
  "Asia/Beirut": "بيروت (لبنان)",
  "Asia/Damascus": "دمشق (سوريا)",
  "Africa/Khartoum": "الخرطوم (السودان)",
  "Africa/Tripoli": "طرابلس (ليبيا)",
  "Africa/Tunis": "تونس",
  "Africa/Algiers": "الجزائر",
  "Africa/Casablanca": "الدار البيضاء (المغرب)",
  "Europe/London": "لندن (بريطانيا)",
  "Europe/Paris": "باريس (فرنسا)",
  "America/New_York": "نيويورك (الولايات المتحدة)",
  UTC: "التوقيت العالمي (UTC)",
};

export const REMINDER_DAYS_LABELS: Record<
  (typeof REMINDER_DAYS)[number],
  string
> = {
  "0": "بدون تذكير",
  "1": "قبل يوم واحد",
  "2": "قبل يومين",
  "3": "قبل 3 أيام",
  "7": "قبل 7 أيام",
};

export const REMINDER_HOURS_LABELS: Record<
  (typeof REMINDER_HOURS)[number],
  string
> = {
  "0": "بدون تذكير",
  "1": "قبل ساعة",
  "2": "قبل ساعتين",
  "3": "قبل 3 ساعات",
  "6": "قبل 6 ساعات",
  "12": "قبل 12 ساعة",
  "24": "قبل 24 ساعة",
};
