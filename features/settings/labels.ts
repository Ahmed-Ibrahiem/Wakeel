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
  "1": "يوم واحد",
  "2": "يومان",
  "3": "3 أيام",
  "7": "7 أيام",
};

export const REMINDER_HOURS_LABELS: Record<
  (typeof REMINDER_HOURS)[number],
  string
> = {
  "0": "بدون تذكير",
  "1": "ساعة واحدة",
  "2": "ساعتان",
  "3": "3 ساعات",
  "6": "6 ساعات",
  "12": "12 ساعة",
  "24": "24 ساعة",
};
