"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { createHearing, updateHearing } from "../actions";
import { hearingFormSchema, type HearingFormValues } from "../schemas";
import { HEARING_TYPE_LABELS } from "../labels";
import { HearingConflictDialog } from "./HearingConflictDialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  hearingId?: string; // if it exists it's an edit, otherwise an addition
  initialValues?: HearingFormValues;
};

const EMPTY: HearingFormValues = {
  hearingDate: "",
  hearingTime: "09:00",
  type: "pleading",
  location: "",
  notes: "",
};

function HearingFormBody({
  caseId,
  hearingId,
  initialValues,
  onDone,
}: {
  caseId: string;
  hearingId?: string;
  initialValues?: HearingFormValues;
  onDone: () => void;
}) {
  const form = useForm<HearingFormValues>({
    resolver: zodResolver(hearingFormSchema),
    defaultValues: initialValues ?? EMPTY,
  });

  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [pendingValues, setPendingValues] = useState<HearingFormValues | null>(
    null,
  );

  const submit = async (values: HearingFormValues, confirmConflict = false) => {
    const result = hearingId
      ? await updateHearing(hearingId, values, confirmConflict)
      : await createHearing(caseId, values, confirmConflict);

    if (!result.success) {
      if (result.conflict) {
        setPendingValues(values);
        setConflictMessage(result.message);
        return;
      }
      toast.error(result.message);
      return;
    }

    toast.success(hearingId ? "تم حفظ التعديلات" : "تمت إضافة الجلسة");
    onDone();
  };

  return (
    <FormProvider {...form}>
      <HearingConflictDialog
        message={conflictMessage}
        onCancel={() => setConflictMessage(null)}
        onConfirm={() => {
          setConflictMessage(null);
          if (pendingValues) void submit(pendingValues, true);
        }}
      />

      <form
        onSubmit={form.handleSubmit((values) => submit(values))}
        noValidate
        className="space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <InputWithLabel<HearingFormValues>
            fieldName="تاريخ الجلسة"
            nameInSchema="hearingDate"
            type="date"
          />
          <InputWithLabel<HearingFormValues>
            fieldName="الوقت"
            nameInSchema="hearingTime"
            type="time"
          />
        </div>

        <SelectWithLabel
          fieldName="نوع الجلسة"
          nameInSchema="type"
          placeholder="حدد نوع الجلسة"
          options={Object.entries(HEARING_TYPE_LABELS).map(([id, label]) => ({
            id,
            label,
          }))}
        />

        <InputWithLabel<HearingFormValues>
          fieldName="المكان (لو مختلف عن محكمة القضية)"
          nameInSchema="location"
          autoComplete="nope"
        />

        <div className="space-y-2">
          <Label htmlFor="notes">ملاحظات (اختياري)</Label>
          <Textarea
            id="notes"
            rows={3}
            maxLength={2000}
            {...form.register("notes")}
          />
          {form.formState.errors.notes && (
            <p className="text-sm text-destructive">
              {form.formState.errors.notes.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full rounded-sm! h-10! max-h-10! text-[16px] cursor-pointer "
        >
          {form.formState.isSubmitting && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {hearingId ? "حفظ التعديلات" : "حفظ الجلسة"}
        </Button>
      </form>
    </FormProvider>
  );
}

export function HearingFormDialog({
  open,
  onOpenChange,
  caseId,
  hearingId,
  initialValues,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{hearingId ? "تعديل الجلسة" : "إضافة جلسة"}</DialogTitle>
          <DialogDescription>
            الوقت بتوقيتك المحلي حسب إعداداتك.
          </DialogDescription>
        </DialogHeader>
        {/* The body mounts fresh every time the dialog opens, so the form never keeps stale values */}
        <HearingFormBody
          caseId={caseId}
          hearingId={hearingId}
          initialValues={initialValues}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}