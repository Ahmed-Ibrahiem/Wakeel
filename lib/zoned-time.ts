// Converts between "wall clock in a time zone" and a UTC instant, using Intl only.

const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string) {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatters.set(timeZone, f);
  }
  return f;
}

function wallClock(instant: Date, timeZone: string) {
  const p: Record<string, string> = {};
  for (const part of getFormatter(timeZone).formatToParts(instant)) {
    if (part.type !== "literal") p[part.type] = part.value;
  }
  return p;
}

// Offset of the zone from UTC at a given instant, in milliseconds.
function offsetMs(instant: Date, timeZone: string) {
  const p = wallClock(instant, timeZone);
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

// UTC instant -> { date: "YYYY-MM-DD", time: "HH:mm" } in the given zone.
export function toZonedParts(instant: Date, timeZone: string) {
  const p = wallClock(instant, timeZone);
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

// "YYYY-MM-DD" + "HH:mm" in the given zone -> UTC instant.
// Returns null for impossible values (e.g. 2026-02-30, or a time skipped by a DST jump).
export function zonedToUtc(date: string, time: string, timeZone: string): Date | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = /^(\d{2}):(\d{2})$/.exec(time);
  if (!d || !t) return null;

  const wall = Date.UTC(+d[1], +d[2] - 1, +d[3], +t[1], +t[2]);
  // Two passes: the offset at the guessed instant can differ from the real one near a DST change.
  let utc = wall - offsetMs(new Date(wall), timeZone);
  utc = wall - offsetMs(new Date(utc), timeZone);

  const result = new Date(utc);
  const back = toZonedParts(result, timeZone);
  if (back.date !== date || back.time !== time) return null;
  return result;
}