"use client";

import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { FormSection } from "@/components/shared/FormSection";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  Check,
  Loader2,
  Scale,
  StickyNote,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { createCase, updateCase } from "../actions";
import { CASE_STATUS_LABELS, CASE_TYPE_LABELS } from "../labels";
import { caseFormSchema, type CaseFormValues } from "../schemas";
import { ClientPreview } from "./ClientPreview";
import { DuplicateCaseDialog } from "./DuplicateCaseDialog";

type ClientOption = {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
};

type Props = {
  clients: ClientOption[];
  caseId?: string; // if it exists it's an edit, otherwise an addition
  initialValues?: CaseFormValues;
};

function Field({
  label,
  htmlFor,
  error,
  hideLabel,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hideLabel?: boolean; // the section title already says it
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className={hideLabel ? "sr-only" : undefined}>
        {label}
      </Label>
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

  // The preview follows the selected client
  const clientId = useWatch({ control: form.control, name: "clientId" });
  const selectedClient = clients.find((c) => c.id === clientId);

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
        className="space-y-5"
      >
        <DuplicateCaseDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          onConfirm={() => {
            if (pendingValues) void submit(pendingValues, true);
          }}
        />

        <FormSection title="بيانات الموكل" icon={UserRound} className="p-6!">
          <div className="grid gap-5 md:grid-cols-2">
            <SelectWithLabel
              fieldName="الموكل"
              nameInSchema="clientId"
              placeholder="اختر الموكل"
              options={clients.map((c) => ({ id: c.id, label: c.fullName }))}
            />
            <ClientPreview client={selectedClient} />
          </div>
        </FormSection>

        <FormSection title="تفاصيل القضية" icon={Scale} className="p-6!">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <InputWithLabel<CaseFormValues>
              fieldName="رقم القضية"
              nameInSchema="caseNumber"
              dir="ltr"
              autoComplete="nope"
            />
            <SelectWithLabel
              fieldName="نوع القضية"
              nameInSchema="caseType"
              placeholder="حدد نوع القضية"
              options={Object.entries(CASE_TYPE_LABELS).map(([id, label]) => ({
                id,
                label,
              }))}
            />
            <InputWithLabel<CaseFormValues>
              fieldName="اسم المحكمة"
              nameInSchema="courtName"
              autoComplete="nope"
            />
            <InputWithLabel<CaseFormValues>
              fieldName="اسم الخصم (اختياري)"
              nameInSchema="opposingParty"
              autoComplete="nope"
            />
          </div>
        </FormSection>

        <div className="grid gap-5 lg:grid-cols-2">
          <FormSection title="الحالة والتواريخ" icon={CalendarDays} className="p-6!">
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectWithLabel
                fieldName="حالة القضية"
                nameInSchema="status"
                placeholder="حدد حالة القضية"
                options={Object.entries(CASE_STATUS_LABELS).map(
                  ([id, label]) => ({ id, label }),
                )}
              />
              <InputWithLabel<CaseFormValues>
                fieldName="تاريخ الحكم (اختياري)"
                nameInSchema="judgmentDate"
                type="date"
              />
            </div>
          </FormSection>

          <FormSection title="ملاحظات إضافية" icon={StickyNote} className="p-6!">
            <Field
              label="ملاحظات (اختياري)"
              htmlFor="notes"
              error={errors.notes?.message}
              hideLabel
            >
              <Textarea
                id="notes"
                rows={4}
                maxLength={2000}
                placeholder="أي ملاحظات إضافية..."
                {...form.register("notes")}
              />
            </Field>
          </FormSection>
        </div>

        {/* Primary first: in RTL it sits on the right, next to the cancel button */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="rounded-sm! h-10"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            {isEdit ? "حفظ التعديلات" : "إضافة القضية"}
          </Button>
          <Button asChild variant="outline" className="rounded-sm! h-10">
            <Link
              href={caseId ? `/dashboard/cases/${caseId}` : "/dashboard/cases"}
            >
              <X className="size-4" />
              إلغاء
            </Link>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
