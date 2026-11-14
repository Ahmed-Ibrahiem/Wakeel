import { z } from "zod";
import { optionalText, requiredText } from "@/lib/validations/text";

export const DEADLINE_STATUSES = ["pending", "done"] as const;

export const deadlineIdSchema = z.uuid();

// string -> string, same style as the other forms. The action turns "" into null.
export const deadlineFormSchema = z.object({
  title: requiredText("العنوان", 120),
  dueDate: z.iso.date("التاريخ غير صحيح"),
  notes: optionalText("الملاحظات", 2000, true),
});

export type DeadlineFormValues = z.infer<typeof deadlineFormSchema>;