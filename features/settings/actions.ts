"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { limitMessage, limitedPerHour } from "@/lib/rateLimit";
import { fail, GENERIC_ERROR } from "@/lib/action-result";
import { getUserSettings } from "@/lib/userSettings";
import { settingsFormSchema, type SettingsFormValues } from "./schemas";

export async function updateSettings(input: SettingsFormValues) {
  const { user } = await requireSession(); // outside try/catch on purpose

  const parsed = settingsFormSchema.safeParse(input);
  if (!parsed.success) return fail("البيانات غير صالحة");

  const limit = await limitedPerHour("settings-update", user.id, 30);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  try {
    // Makes sure the row exists (it self-heals if it is missing), then updates it
    await getUserSettings(user.id);

    const [row] = await db
      .update(userSettings)
      .set({
        timeZone: parsed.data.timeZone,
        reminderDaysBefore: Number(parsed.data.reminderDays),
        reminderHoursBefore: Number(parsed.data.reminderHours),
        updatedAt: new Date(),
      })
      // Ownership in the same UPDATE condition, userId comes from the session
      .where(eq(userSettings.userId, user.id))
      .returning({ userId: userSettings.userId });

    if (!row) return fail(GENERIC_ERROR);
  } catch (error) {
    console.error("updateSettings failed", error);
    return fail(GENERIC_ERROR);
  }

  // The time zone affects every page that shows a date, so refresh the whole dashboard layout
  revalidatePath("/dashboard", "layout");
  return { success: true as const };
}