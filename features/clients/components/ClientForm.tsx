"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { PhoneInput } from "@/components/inputs/PhoneInput";
import { createClient, updateClient } from "../actions";
import { clientFormSchema, type ClientFormValues } from "../schemas";

type Props = {
  today: string;
  clientId?: string; // If it exists, it remains an amendment, if it does not remain an addition
  initialValues?: ClientFormValues;
};

export function ClientForm({ today, clientId, initialValues }: Props) {
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
    router.push("/dashboard/clients");
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-7 rounded-xl border bg-background p-6"
      >
        <InputWithLabel<ClientFormValues>
          fieldName="الاسم بالكامل"
          nameInSchema="fullName"
          autoComplete="nope"
        />

        <div className="grid gap-7 md:grid-cols-2">
          <InputWithLabel<ClientFormValues>
            fieldName="البريد الإلكتروني (اختياري)"
            nameInSchema="email"
            type="email"
            dir="ltr"
            autoComplete="nope"
          />
          <InputWithLabel<ClientFormValues>
            fieldName="تاريخ أول تعامل"
            nameInSchema="firstContactDate"
            type="date"
            max={today}
          />
        </div>

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

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button asChild variant="outline" className="rounded-sm!">
            <Link href="/dashboard/clients">إلغاء</Link>
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="rounded-sm!"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {isEdit ? "حفظ التعديلات" : "حفظ العميل"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
