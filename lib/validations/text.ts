import { z } from "zod";

// Control chars (\p{Cc}) and format chars (\p{Cf}: zero-width, RTL override...)
const INVISIBLE = /[\p{Cc}\p{Cf}]/gu;
const HAS_LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;

const cleanSingleLine = (s: string) =>
  s.replace(INVISIBLE, "").replace(/\s+/g, " ").trim();

// notes keep their line breaks
const cleanMultiLine = (s: string) =>
  s
    .replace(/[\p{Cc}\p{Cf}]/gu, (m) => (m === "\n" ? "\n" : ""))
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export function requiredText(label: string, max: number) {
  return z
    .string()
    .transform(cleanSingleLine)
    .pipe(
      z
        .string()
        .min(1, `${label} مطلوب`)
        .max(max, `${label} طويل جداً`)
        .refine((s) => HAS_LETTER_OR_DIGIT.test(s), `${label} غير صالح`),
    );
}

// optional: stays a string ("" when empty). The action turns "" into null.
export function optionalText(label: string, max: number, multiline = false) {
  return z
    .string()
    .transform(multiline ? cleanMultiLine : cleanSingleLine)
    .pipe(z.string().max(max, `${label} طويل جداً`));
}