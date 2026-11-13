"use client";

import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { createCase, updateCase } from "../actions";
import { caseFormSchema, type CaseFormValues } from "../schemas";
import { CASE_STATUS_LABELS, CASE_TYPE_LABELS } from "../labels";
import { DuplicateCaseDialog } from "./DuplicateCaseDialog";
import { useState } from "react";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";

type Props = {
  clients: { id: string; fullName: string }[];
  caseId?: string; // if it exists it's an edit, otherwise an addition
  initialValues?: CaseFormValues;
};

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function CaseForm({ clients, caseId, initialValues }: Props) {
  const router = useRouter();
  const isEdit = Boolean(caseId);

  // 3 generics: the form holds the INPUT shape, the submit receives the OUTPUT (after Zod cleaning)
  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: initialValues ?? {
      clientId: "",
      caseNumber: "",
      caseType: "civil",
      courtName: "",
      opposingParty: "",
      status: "ongoing",
      judgmentDate: "",
      notes: "",
    },
  });

  const errors = form.formState.errors;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<CaseFormValues | null>(
    null,
  );

  const submit = async (values: CaseFormValues, confirmDuplicate = false) => {
    const result = caseId
      ? await updateCase(caseId, values, confirmDuplicate)
      : await createCase(values, confirmDuplicate);

    if (!result.success) {
      if ("duplicate" in result && result.duplicate) {
        setPendingValues(values);
        setConfirmOpen(true);
        return;
      }
      toast.error(result.message);
      return;
    }

    toast.success(caseId ? "تم حفظ التعديلات" : "تمت إضافة القضية");
    router.push(caseId ? `/dashboard/cases/${caseId}` : "/dashboard/cases");
  };

  const onSubmit = (values: CaseFormValues) => submit(values);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-7 rounded-sm border bg-background p-6"
      >
        <DuplicateCaseDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          onConfirm={() => {
            if (pendingValues) void submit(pendingValues, true);
          }}
        />

        <SelectWithLabel
          fieldName="الموكل"
          nameInSchema="clientId"
          placeholder="اختر الموكل"
          options={clients.map((c) => ({ id: c.id, label: c.fullName }))}
        />

        <div className="grid gap-7 md:grid-cols-2">
          <InputWithLabel<CaseFormValues>
            fieldName="رقم القضية"
            nameInSchema="caseNumber"
            dir="ltr"
            autoComplete="nope"
          />
          <InputWithLabel<CaseFormValues>
            fieldName="اسم المحكمة"
            nameInSchema="courtName"
            autoComplete="nope"
          />
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <SelectWithLabel
            fieldName="نوع القضية"
            nameInSchema="caseType"
            placeholder="حدد نوع القضية"
            options={Object.entries(CASE_TYPE_LABELS).map(([id, label]) => ({
              id,
              label,
            }))}
          />

          <SelectWithLabel
            fieldName="حالة القضية"
            nameInSchema="status"
            placeholder="حدد نوع القضية"
            options={Object.entries(CASE_STATUS_LABELS).map(([id, label]) => ({
              id,
              label,
            }))}
          />
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <InputWithLabel<CaseFormValues>
            fieldName="اسم الخصم (اختياري)"
            nameInSchema="opposingParty"
            autoComplete="nope"
          />
          <InputWithLabel<CaseFormValues>
            fieldName="تاريخ الحكم (اختياري)"
            nameInSchema="judgmentDate"
            type="date"
          />
        </div>

        <Field
          label="ملاحظات (اختياري)"
          htmlFor="notes"
          error={errors.notes?.message}
        >
          <Textarea
            id="notes"
            rows={4}
            maxLength={2000}
            {...form.register("notes")}
          />
        </Field>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button asChild variant="outline" className="rounded-sm!">
            <Link
              href={caseId ? `/dashboard/cases/${caseId}` : "/dashboard/cases"}
            >
              إلغاء
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="rounded-sm!"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {isEdit ? "حفظ التعديلات" : "حفظ القضية"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
