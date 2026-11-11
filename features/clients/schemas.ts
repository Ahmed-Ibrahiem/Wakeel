import { COUNTRIES } from "@/lib/countries";
import * as z from "zod";

export const PAGE_SIZE = [8, 10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 8;

export const clientsListSchema = z.object({
  q: z.string().trim().max(100).catch(""),
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  pageSize: z.coerce
    .number()
    .refine((v) => (PAGE_SIZE as readonly number[]).includes(v))
    .catch(DEFAULT_PAGE_SIZE),
  archived: z
    .literal("1")
    .optional()
    .catch(undefined)
    .transform((v) => v === "1"),
});

export type ClientsListParams = z.infer<typeof clientsListSchema>;

export const clientFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "الاسم قصير جداً")
    .max(120, "الاسم طويل جداً")
    .transform((s) =>
      s
        .replace(/[\p{Cc}\p{Cf}]/gu, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .refine((s) => s.length >= 2 && /[\p{L}\p{N}]/u.test(s), "الاسم غير صالح"),
  dialCode: z
    .string()
    .refine((v) => COUNTRIES.some((c) => c.dial === v), "كود غير صالح"),
  phoneLocal: z
    .string()
    .trim()
    .regex(/^(\d{7,12})?$/, "رقم غير صالح"),
  email: z
    .string()
    .trim()
    .max(254, "البريد طويل جداً")
    .refine((v) => v === "" || z.email().safeParse(v).success, "بريد غير صالح"),
  address: z.string().trim().max(300, "العنوان طويل جداً"),
  firstContactDate: z.iso.date("تاريخ غير صالح"),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
