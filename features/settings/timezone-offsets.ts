import { TIME_ZONES } from "./schemas";

// "GMT+02:00" -> "UTC+02:00". Intl returns plain "GMT" for a zero offset.
export function getUtcOffsetLabel(timeZone: string, date: Date): string {
  const raw =
    new Intl.DateTimeFormat("en", { timeZone, timeZoneName: "longOffset" })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT";

  return `UTC${raw === "GMT" ? "+00:00" : raw.replace("GMT", "")}`;
}

// One pass over the allowed zones, computed on the server for the current moment (DST-aware)
export function getTimeZoneOffsets(): Record<string, string> {
  const now = new Date();
  return Object.fromEntries(
    TIME_ZONES.map((zone) => [zone, getUtcOffsetLabel(zone, now)]),
  );
}