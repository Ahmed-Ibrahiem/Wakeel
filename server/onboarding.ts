"use server";
import { auth } from "@/lib/auth";
import { toE164 } from "@/lib/phone";
import { requireSession } from "@/lib/session";
import { onboardingSchema, OnboardingValues } from "@/lib/validations/auth";
import { headers } from "next/headers";

export const completeOnboarding = async (input: OnboardingValues) => {
  await requireSession();

  const parse = onboardingSchema.safeParse(input);
  if (!parse) return { success: false, message: "البيانات غير صالحة" };

  const phone = toE164(input.dialCode, input.phoneLocal);

  try {
    await auth.api.updateUser({ body: { phone }, headers: await headers() });
    return { success: true, message: "تم حفظ البيانات" };
  } catch (e) {
    console.error("onboarding failed:", e);
    return { success: false, message: "تعذّر حفظ البيانات" };
  }
};
