import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { processReminders } from "@/features/reminders/process";
// Never cache: every call must run fresh
export const dynamic = "force-dynamic";

// Fail closed: a missing secret means nobody is authorized
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const received = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);

  // timingSafeEqual throws on different lengths, so compare lengths first
  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await processReminders();
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error("[reminders] run failed:", err);
    return NextResponse.json({ error: "Reminder run failed" }, { status: 500 });
  }
}
