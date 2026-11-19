import { z } from "zod";

export const CASE_TAB_IDS = [
  "overview",
  "hearings",
  "deadlines",
  "notes",
] as const;

export type CaseTab = (typeof CASE_TAB_IDS)[number];

export const CASE_TAB_LABELS: Record<CaseTab, string> = {
  overview: "تفاصيل القضية",
  hearings: "الجلسات",
  deadlines: "المواعيد النهائية",
  notes: "الملاحظات",
};

// The URL is the state: an unknown or missing value falls back to the first tab
export const caseTabSchema = z.enum(CASE_TAB_IDS).catch("overview");