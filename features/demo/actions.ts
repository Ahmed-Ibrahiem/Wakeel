"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { fail, GENERIC_ERROR } from "@/lib/action-result";
import { getClientIp } from "@/lib/request";
import { checkRateLimits, limitMessage } from "@/lib/rateLimit";
import { DEMO_EMAIL } from "./constants";
import { ensureDemoUser, resetDemoData } from "./seed";

// Signs the visitor into the shared demo account with fresh sample data
export async function startDemo() {
  const limit = await checkRateLimits([
    {
      name: "demo-start",
      id: await getClientIp(),
      max: 10,
      windowSec: 3600,
    },
  ]);
  if (!limit.ok) return fail(limitMessage(limit.retryAfterSec));

  const password = process.env.DEMO_PASSWORD;
  if (!password) {
    console.error("startDemo: DEMO_PASSWORD is not set");
    return fail(GENERIC_ERROR);
  }

  try {
    await ensureDemoUser(password);
    await resetDemoData();
    await auth.api.signInEmail({
      body: { email: DEMO_EMAIL, password },
      headers: await headers(),
    });
  } catch (error) {
    console.error("startDemo failed", error);
    return fail(GENERIC_ERROR);
  }

  return { success: true as const };
}