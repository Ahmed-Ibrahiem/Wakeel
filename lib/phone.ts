export const E164_RE = /^\+[1-9]\d{7,14}$/;

export function toE164(dialCode: string, local: string) {
  return dialCode + local.replace(/\D/g, "").replace(/^0+/, "");
}
