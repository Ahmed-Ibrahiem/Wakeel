"use client";

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
import { createDeadline, updateDeadline } from "../actions";
import { deadlineFormSchema, type DeadlineFormValues } from "../schemas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  deadlineId?: string; // if it exists it's an edit, otherwise an addition
  initialValues?: DeadlineFormValues;
};

const EMPTY: DeadlineFormValues = { title: "", dueDate: "", notes: "" };

function DeadlineFormBody({
  caseId,
  deadlineId,
  initialValues,
  onDone,
}: {
  caseId: string;
  deadlineId?: string;
  initialValues?: DeadlineFormValues;
  onDone: () => void;
}) {
  const form = useForm<DeadlineFormValues>({
    resolver: zodResolver(deadlineFormSchema),
    defaultValues: initialValues ?? EMPTY,
  });

  const submit = async (values: DeadlineFormValues) => {
    const result = deadlineId
      ? await updateDeadline(deadlineId, values)
      : await createDeadline(caseId, values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(deadlineId ? "تم حفظ التعديلات" : "تمت إضافة الموعد");
    onDone();
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        noValidate
        className="space-y-6"
      >
        <InputWithLabel<DeadlineFormValues>
          fieldName="عنوان الموعد (مثال: آخر ميعاد للاستئناف)"
          nameInSchema="title"
          autoComplete="nope"
        />

        <InputWithLabel<DeadlineFormValues>
          fieldName="تاريخ الاستحقاق"
          nameInSchema="dueDate"
          type="date"
        />

        <div className="space-y-2">
          <Label htmlFor="deadline-notes">ملاحظات (اختياري)</Label>
          <Textarea
            id="deadline-notes"
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
          className="w-full rounded-sm!"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {deadlineId ? "حفظ التعديلات" : "حفظ الموعد"}
        </Button>
      </form>
    </FormProvider>
  );
}

export function DeadlineFormDialog({
  open,
  onOpenChange,
  caseId,
  deadlineId,
  initialValues,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {deadlineId ? "تعديل الموعد" : "إضافة موعد نهائي"}
          </DialogTitle>
          <DialogDescription>
            مواعيد مثل آخر يوم للاستئناف أو لتقديم مذكرة.
          </DialogDescription>
        </DialogHeader>
        {/* Mounts fresh on every open, so the form never keeps old values */}
        <DeadlineFormBody
          caseId={caseId}
          deadlineId={deadlineId}
          initialValues={initialValues}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}