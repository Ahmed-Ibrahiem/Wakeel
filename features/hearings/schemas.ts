import { z } from "zod";
import { optionalText, requiredText } from "@/lib/validations/text";

export const HEARING_TYPES = ["pleading", "ruling", "other"] as const;
export const HEARING_STATUSES = ["scheduled", "completed", "postponed"] as const;

export const hearingIdSchema = z.uuid();

// Date and time stay strings (string -> string), same style as the cases form.
// They are combined into one UTC instant in the action, using the lawyer's time zone.
const isoDate = z.iso.date("التاريخ غير صحيح");
const time24 = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "الوقت غير صحيح");

export const hearingFormSchema = z.object({
  hearingDate: isoDate,
  hearingTime: time24,
  type: z.enum(HEARING_TYPES),
  location: optionalText("المكان", 120),
  notes: optionalText("الملاحظات", 2000, true),
});

export type HearingFormValues = z.infer<typeof hearingFormSchema>;

// Record the decision and (optionally) the next hearing in one step.
// The next hearing needs both date and time, or neither.
export const hearingOutcomeSchema = z
  .object({
    outcome: requiredText("القرار", 1000),
    nextDate: z.union([z.literal(""), isoDate]),
    nextTime: z.union([z.literal(""), time24]),
    nextType: z.enum(HEARING_TYPES),
  })
  .superRefine((v, ctx) => {
    if (v.nextDate && !v.nextTime) {
      ctx.addIssue({ code: "custom", path: ["nextTime"], message: "حدد وقت الجلسة القادمة" });
    }
    if (v.nextTime && !v.nextDate) {
      ctx.addIssue({ code: "custom", path: ["nextDate"], message: "حدد تاريخ الجلسة القادمة" });
    }
  });

export type HearingOutcomeValues = z.infer<typeof hearingOutcomeSchema>;