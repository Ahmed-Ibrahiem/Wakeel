import { pageSizeSchema } from "@/lib/pagination";
import { optionalText, requiredText } from "@/lib/validations/text";
import { z } from "zod";

// Keep in sync with db/schema/enums.ts (TypeScript will complain on insert if they drift)
export const CASE_TYPES = [
  "civil",
  "criminal",
  "commercial",
  "family",
  "labor",
  "other",
] as const;
export const CASE_STATUSES = ["ongoing", "postponed", "closed"] as const;

export const caseIdSchema = z.uuid();

// ---- list page: the URL is the state, bad values fall back, never error ----
export const caseListParamsSchema = z.object({
  q: z.string().trim().max(100).catch(""),
  page: z.coerce.number().int().min(1).max(10000).catch(1),
  pageSize: pageSizeSchema,
  status: z.enum(["all", ...CASE_STATUSES]).catch("all"),
  archived: z
    .string()
    .transform((v) => v === "1")
    .catch(false),
});
export type CaseListParams = z.output<typeof caseListParamsSchema>;

// ---- form: shared by the client form and the server action ----
export const caseFormSchema = z.object({
  clientId: z.uuid("اختر الموكل"),
  caseNumber: requiredText("رقم القضية", 50),
  caseType: z.enum(CASE_TYPES, "نوع القضية غير صالح"),
  courtName: requiredText("اسم المحكمة مطلوب", 120),
  opposingParty: optionalText("اسم الخصم", 120),
  status: z.enum(CASE_STATUSES, "حالة القضية غير صالحة"),
  judgmentDate: z.union([z.literal(""), z.iso.date("التاريخ غير صالح")]),
  notes: optionalText("الملاحظات", 2000, true),
});

export type CaseFormValues = z.infer<typeof caseFormSchema>;
