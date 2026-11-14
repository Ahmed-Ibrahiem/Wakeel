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
import { recordHearingOutcome } from "../actions";
import { hearingOutcomeSchema, type HearingOutcomeValues } from "../schemas";
import { HEARING_TYPE_LABELS } from "../labels";
import { HearingConflictDialog } from "./HearingConflictDialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hearingId: string;
};

const EMPTY: HearingOutcomeValues = {
  outcome: "",
  nextDate: "",
  nextTime: "", // stays empty on purpose: date and time must be filled together or not at all
  nextType: "pleading",
};

function OutcomeFormBody({
  hearingId,
  onDone,
}: {
  hearingId: string;
  onDone: () => void;
}) {
  const form = useForm<HearingOutcomeValues>({
    resolver: zodResolver(hearingOutcomeSchema),
    defaultValues: EMPTY,
  });

  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [pendingValues, setPendingValues] =
    useState<HearingOutcomeValues | null>(null);

  const submit = async (
    values: HearingOutcomeValues,
    confirmConflict = false,
  ) => {
    const result = await recordHearingOutcome(
      hearingId,
      values,
      confirmConflict,
    );

    if (!result.success) {
      if (result.conflict) {
        setPendingValues(values);
        setConflictMessage(result.message);
        return;
      }
      toast.error(result.message);
      return;
    }

    toast.success("تم تسجيل القرار");
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
        <div className="space-y-2">
          <Label htmlFor="outcome">قرار الجلسة</Label>
          <Textarea
            id="outcome"
            rows={4}
            maxLength={1000}
            {...form.register("outcome")}
          />
          {form.formState.errors.outcome && (
            <p className="text-sm text-destructive">
              {form.formState.errors.outcome.message}
            </p>
          )}
        </div>

        <fieldset className="space-y-4 rounded-sm border p-4">
          <legend className="px-2 text-sm font-medium">
            الجلسة القادمة (اختياري)
          </legend>
          <p className="text-xs text-muted-foreground">
            سيب التاريخ والوقت فاضيين لو مفيش جلسة قادمة، وهتتعلّم الجلسة دي
            «تمت».
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputWithLabel<HearingOutcomeValues>
              fieldName="التاريخ"
              nameInSchema="nextDate"
              type="date"
            />
            <InputWithLabel<HearingOutcomeValues>
              fieldName="الوقت"
              nameInSchema="nextTime"
              type="time"
            />
          </div>
          <SelectWithLabel
            fieldName="نوع الجلسة القادمة"
            nameInSchema="nextType"
            placeholder="حدد نوع الجلسة"
            options={Object.entries(HEARING_TYPE_LABELS).map(([id, label]) => ({
              id,
              label,
            }))}
          />
        </fieldset>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full rounded-sm!"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="size-4 animate-spin" />
          )}
          حفظ
        </Button>
      </form>
    </FormProvider>
  );
}

export function HearingOutcomeDialog({ open, onOpenChange, hearingId }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>تسجيل قرار الجلسة</DialogTitle>
          <DialogDescription>
            سجّل القرار وحدد الجلسة القادمة في خطوة واحدة.
          </DialogDescription>
        </DialogHeader>
        {/* Mounts fresh on every open, so the form never keeps old values */}
        <OutcomeFormBody
          hearingId={hearingId}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}