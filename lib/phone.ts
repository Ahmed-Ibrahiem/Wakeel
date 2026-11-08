export const E164_RE = /^\+[1-9]\d{7,14}$/;

export function toE164(dialCode: string, local: string) {
  return dialCode + local.replace(/\D/g, "").replace(/^0+/, "");
}

export function formatPhone(e164: string | null) {
  if (!e164) return "—";
  return e164.startsWith("+20") ? "0" + e164.slice(3) : e164;
}