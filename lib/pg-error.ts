// Postgres error code, even when the driver wraps it inside `cause`
export function pgCode(e: unknown): string | undefined {
  let cur = e as { code?: unknown; cause?: unknown } | undefined;
  for (let i = 0; i < 4 && cur; i++) {
    if (typeof cur.code === "string") return cur.code;
    cur = cur.cause as typeof cur;
  }
  return undefined;
}