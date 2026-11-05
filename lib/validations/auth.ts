import * as z from "zod";
import { COUNTRIES } from "@/lib/countries";

const phoneFields = {
  dialCode: z
    .string()
    .refine((v) => COUNTRIES.some((c) => c.dial === v), "كود غير صالح"),
  phoneLocal: z.string().regex(/^\d{7,12}$/, "رقم غير صالح"),
};

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "الاسم قصير جداً"),
    email: z.email("بريد غير صالح").max(254),
    ...phoneFields,
    password: z.string().min(8, "8 أحرف على الأقل"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, "يجب الموافقة على الشروط"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "كلمتا المرور غير متطابقتين",
  });

export const signInSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1),
});

export const onboardingSchema = z.object({
  ...phoneFields,
  terms: z.boolean().refine((v) => v === true, "يجب الموافقة علي الشروط"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("بريد غير صالح").max(254),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "كلمتا السر غير متطابقتين",
  });

export type SignUpValues = z.infer<typeof signUpSchema>;
export type SignInValues = z.infer<typeof signInSchema>;
export type OnboardingValues = z.infer<typeof onboardingSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
