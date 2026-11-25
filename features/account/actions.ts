"use server";

import { headers } from "next/headers";
import { APIError } from "better-auth";
import { auth } from "@/lib/auth";
import { requireSession } from "@/lib/session";
import { limitMessage, limitedPerHour } from "@/lib/rateLimit";
import { fail, GENERIC_ERROR } from "@/lib/action-result";
import { hasPasswordLogin } from "./queries";
import { changePasswordSchema, deleteAccountSchema } from "./schemas";
import { isDemoUser } from "../demo/constants";

export async function changePassword(input: unknown) {
  const { user } = await requireSession(); // outside try/catch on purpose

  if (isDemoUser(user.id))
    return fail("هذا الإجراء غير متاح في الحساب التجريبي");

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  // Guessing the current password is the attack here, so the cap is low
  const limit = await limitedPerHour("password-change", user.id, 5);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  if (!(await hasPasswordLogin(user.id))) {
    return fail("حسابك مرتبط بجوجل ولا توجد له كلمة مرور");
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError && error.body?.code === "INVALID_PASSWORD") {
      return fail("كلمة المرور الحالية غير صحيحة");
    }
    console.error("changePassword failed", error);
    return fail(GENERIC_ERROR);
  }

  // The password is already changed. Sign out every OTHER device; this session is kept
  // as it is (revoking inside changePassword replaces it and bounces the user to the dashboard).
  try {
    await auth.api.revokeOtherSessions({ headers: await headers() });
  } catch (error) {
    console.error("revokeOtherSessions failed", error);
  }

  return { success: true as const };
}

export async function deleteAccount(input: unknown) {
  const { user } = await requireSession(); // outside try/catch on purpose

  if (isDemoUser(user.id))
    return fail("هذا الإجراء غير متاح في الحساب التجريبي");

  const parsed = deleteAccountSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  const limit = await limitedPerHour("account-delete", user.id, 3);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  const withPassword = await hasPasswordLogin(user.id);
  if (withPassword && !parsed.data.password) {
    return fail("أدخل كلمة المرور لتأكيد الحذف");
  }

  try {
    // Better Auth checks the password (or a fresh session for Google accounts), runs
    // beforeDelete (our data), then removes the user, sessions and accounts
    await auth.api.deleteUser({
      body: withPassword ? { password: parsed.data.password } : {},
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.body?.code === "INVALID_PASSWORD") {
        return fail("كلمة المرور غير صحيحة");
      }
      if (error.body?.code === "SESSION_EXPIRED") {
        return fail(
          "لأسباب أمنية، سجّل الخروج ثم سجّل الدخول من جديد قبل حذف حسابك",
        );
      }
    }
    console.error("deleteAccount failed", error);
    return fail(GENERIC_ERROR);
  }

  return { success: true as const };
}
