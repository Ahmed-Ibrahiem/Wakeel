import { lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { ActionRateLimits } from "@/db/schema";

export type Rule = { name: string; id: string; max: number; windowSec: number };

async function hit({ name, id, max, windowSec }: Rule) {
  const windowMs = windowSec * 1000;
  const bucket = Math.floor(Date.now() / windowMs);
  const expiresAt = new Date((bucket + 1) * windowMs);

  const [row] = await db
    .insert(ActionRateLimits)
    .values({ key: `${name}:${id}:${bucket}`, count: 1, expiresAt })
    .onConflictDoUpdate({
      target: ActionRateLimits.key,
      set: { count: sql`${ActionRateLimits.count} + 1` },
    })
    .returning({ count: ActionRateLimits.count });

  if (Math.random() < 0.02) {
    await db
      .delete(ActionRateLimits)
      .where(lt(ActionRateLimits.expiresAt, new Date()))
      .catch(() => {});
  }

  return {
    allowed: row.count <= max,
    retryAfterSec: Math.max(
      1,
      Math.ceil((expiresAt.getTime() - Date.now()) / 1000),
    ),
  };
}

export async function checkRateLimits(rules: Rule[]) {
  const results = await Promise.all(rules.map(hit));
  const blocked = results.filter((r) => !r.allowed);
  if (blocked.length === 0) return { ok: true as const };
  return {
    ok: false as const,
    retryAfterSec: Math.max(...blocked.map((r) => r.retryAfterSec)),
  };
}

export function limitMessage(sec: number) {
  return `محاولات كثيرة. حاول مرة أخرى بعد ${Math.ceil(sec / 60)} دقيقة.`;
}

// One hourly bucket per action name and user
export const limitedPerHour = (name: string, userId: string, max: number) =>
  checkRateLimits([{ name, id: userId, max, windowSec: 3600 }]);