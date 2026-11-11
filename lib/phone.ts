import { COUNTRIES } from "./countries";

export const E164_RE = /^\+[1-9]\d{7,14}$/;

export function toE164(dialCode: string, local: string) {
  return dialCode + local.replace(/\D/g, "").replace(/^0+/, "");
}

export function formatPhone(e164: string | null) {
  if (!e164) return "—";
  return e164.startsWith("+20") ? "0" + e164.slice(3) : e164;
}

export function splitPhone(e164: string | null) {
  const fallback = { dialCode: "+20", phoneLocal: "" };
  if (!e164) return fallback;

  const country = [...COUNTRIES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((c) => e164.startsWith(c.dial));
  if (!country) return fallback;

  const rest = e164.slice(country.dial.length);
  return {
    dialCode: country.dial as string,
    phoneLocal: country.dial === "+20" ? "0" + rest : rest,
  };
}
