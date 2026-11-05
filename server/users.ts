"use server";
import { APIError } from "better-auth";
import { auth } from "@/lib/auth";
import { toE164 } from "@/lib/phone";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";
import { checkRateLimits, limitMessage } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/request";

export const signIn = async (input: unknown) => {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "البيانات غير صالحة" };

  const { email, password } = parsed.data;

  const ip = await getClientIp();
  const limit = await checkRateLimits([
    { id: ip, max: 20, name: "signin-ip", windowSec: 300 },
    { name: "signin-email", id: email.toLowerCase(), max: 10, windowSec: 900 },
  ]);

  if (!limit.ok) {
    return { success: false, message: limitMessage(limit.retryAfterSec) };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });

    return {
      success: true,
      message: "تم تسجيل دخول بنجاح.",
    };
  } catch (error) {
    if (error instanceof APIError && error.statusCode === 403) {
      return {
        success: false,
        message:
          "حسابك غير مفعّل. تحقق من بريدك الإلكتروني (وفولدر الرسائل غير المرغوبة) للحصول على رابط التفعيل.",
      };
    }
    console.error("signIn failed:", error);
    return { success: false, message: "البريد أو كلمة المرور غير صحيحة" };
  }
};

export const signUp = async (input: unknown) => {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "البيانات غير صالحة" };

  const { name, email, password, dialCode, phoneLocal } = parsed.data;

  const ip = await getClientIp();
  const limit = await checkRateLimits([
    { name: "signup-ip", id: ip, max: 10, windowSec: 3600 },
    { name: "signup-email", id: email.toLowerCase(), max: 3, windowSec: 3600 },
  ]);

  if (!limit.ok) {
    return { success: false, message: limitMessage(limit.retryAfterSec) };
  }

  const phone = toE164(dialCode, phoneLocal);

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        phone,
        callbackURL: "/dashboard",
      },
    });

    return {
      success: true,
      message: "تحقق من بريدك الإلكتروني لتفعيل الحساب",
    };
  } catch (e) {
    console.error("signUp failed:", e);
    return {
      success: false,
      message: "تعذّر إنشاء الحساب، تحقق من البيانات",
    };
  }
};
