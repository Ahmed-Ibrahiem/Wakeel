import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "أدخل كلمة المرور الحالية")
      .max(128, "كلمة المرور طويلة جداً"),
    newPassword: z
      .string()
      .min(8, "يجب ألا تقل كلمة المرور عن 8 أحرف")
      .max(128, "كلمة المرور طويلة جداً"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "كلمتا المرور غير متطابقتين",
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    path: ["newPassword"],
    message: "اختر كلمة مرور مختلفة عن الحالية",
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  password: z.string().max(128, "كلمة المرور طويلة جداً"),
  confirmation: z
    .string()
    .refine((v) => v.trim() === "حذف", "اكتب كلمة «حذف» للتأكيد"),
});

export type DeleteAccountValues = z.infer<typeof deleteAccountSchema>;
