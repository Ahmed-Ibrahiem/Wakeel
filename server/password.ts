"use server";

import { auth } from "@/lib/auth";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { checkRateLimits, limitMessage } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/request";

export async function requestPasswordReset(input: unknown) {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "بريد غير صالح" };
  const email = parsed.data.email.toLowerCase();

  const ip = await getClientIp();
  const limit = await checkRateLimits([
    { name: "reset-ip", id: ip, max: 10, windowSec: 3600 },
    { name: "reset-email", id: email, max: 3, windowSec: 3600 },
  ]);

  if (!limit.ok) {
    return { success: false, message: limitMessage(limit.retryAfterSec) };
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: parsed.data.email,
        redirectTo: `${process.env.BETTER_AUTH_URL}/reset-password`,
      },
    });
  } catch (e) {
    console.error("reset request failed:", e);
  }

  return {
    success: true,
    message: "لو الإيميل مسجل بالفعل ستصلك رسالة لتعيين كلمة المرور",
  };
}

export async function resetPassword(input: unknown) {
  const parsed = resetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "البيانات غير صالحة" };
  }

  const ip = await getClientIp();
  const limit = await checkRateLimits([
    { name: "reset-submit-ip", id: ip, max: 10, windowSec: 3600 },
  ]);
  if (!limit.ok) {
    return { success: false, message: limitMessage(limit.retryAfterSec) };
  }

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: parsed.data.password,
        token: parsed.data.token,
      },
    });

    return {
      success: true,
      message: "تم تغيير كلمة المرور بنجاح",
    };
  } catch (e) {
    console.error("reset password failed:", e);

    return {
      success: false,
      message: "الرابط غير صالح أو منتهي. اطلب رابطاً جديداً.",
    };
  }
}
