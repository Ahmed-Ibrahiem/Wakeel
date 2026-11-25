"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Contact, Loader2, UserPen, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { PhoneInput } from "@/components/inputs/PhoneInput";
import { createClient, updateClient } from "../actions";
import { clientFormSchema, type ClientFormValues } from "../schemas";
import { FormSection } from "@/components/shared/FormSection";

type Props = {
  today: string;
  clientId?: string; // If it exists, it remains an amendment, if it does not remain an addition
  initialValues?: ClientFormValues;
  fromCase?: boolean; // opened from "add case": go back there after saving
};

export function ClientForm({
  today,
  clientId,
  initialValues,
  fromCase,
}: Props) {
  const router = useRouter();
  const isEdit = Boolean(clientId);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialValues ?? {
      fullName: "",
      dialCode: "+20",
      phoneLocal: "",
      email: "",
      address: "",
      firstContactDate: today,
    },
  });

  const onSubmit = async (values: ClientFormValues) => {
    const result = clientId
      ? await updateClient(clientId, values)
      : await createClient(values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "تم حفظ التعديلات" : "تمت إضافة العميل");
    // createClient returns the new id; updateClient does not
    const newClientId = "id" in result ? result.id : null;
    router.push(
      fromCase && newClientId
        ? `/dashboard/cases/new?clientId=${newClientId}`
        : "/dashboard/clients",
    );
  };

  // Edit mode: return to wherever the lawyer came from (details page, list, ...).
  // If the page was opened directly there is no history, so fall back to the list.
  const handleCancelEdit = () => {
    if (window.history.length > 1) router.back();
    else router.push("/dashboard/clients");
  };

  return (
    <FormProvider {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <FormSection title="بيانات الموكل" icon={UserPen} className="p-6!">
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
            <InputWithLabel<ClientFormValues>
              fieldName="الاسم بالكامل"
              nameInSchema="fullName"
              autoComplete="nope"
            />

            <InputWithLabel<ClientFormValues>
              fieldName="تاريخ أول تعامل"
              nameInSchema="firstContactDate"
              type="date"
              max={today}
            />
          </div>
        </FormSection>

        <FormSection title="بيانات التواصل" icon={Contact} className="p-6!">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputWithLabel<ClientFormValues>
              fieldName="البريد الإلكتروني (اختياري)"
              nameInSchema="email"
              type="email"
              dir="ltr"
              autoComplete="nope"
            />

            <PhoneInput<ClientFormValues>
              label="رقم الهاتف (اختياري)"
              dialCodeName="dialCode"
              phoneName="phoneLocal"
            />

            <InputWithLabel<ClientFormValues>
              fieldName="العنوان (اختياري)"
              nameInSchema="address"
              autoComplete="nope"
            />
          </div>
        </FormSection>

        <div className="flex flex-col gap-3 sm:flex-row ">
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
            {isEdit ? "حفظ التعديلات" : "حفظ العميل"}
          </Button>
          {isEdit ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-sm! h-10"
              onClick={handleCancelEdit}
            >
              <X className="size-4" />
              إلغاء
            </Button>
          ) : (
            <Button asChild variant="outline" className="rounded-sm! h-10">
              <Link
                href={fromCase ? "/dashboard/cases/new" : "/dashboard/clients"}
              >
                <X className="size-4" />
                إلغاء
              </Link>
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
