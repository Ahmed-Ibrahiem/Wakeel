"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { updateSettings } from "../actions";
import { settingsFormSchema, type SettingsFormValues } from "../schemas";
import {
  REMINDER_DAYS_LABELS,
  REMINDER_HOURS_LABELS,
  TIME_ZONE_LABELS,
} from "../labels";

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([id, label]) => ({ id, label }));

export function SettingsForm({
  initialValues,
}: {
  initialValues: SettingsFormValues;
}) {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: SettingsFormValues) => {
    const result = await updateSettings(values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("تم حفظ الإعدادات");
    // Makes the saved values the new baseline, so the button is disabled until the next change
    form.reset(values);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-8 rounded-sm border bg-background p-6"
      >
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">المنطقة الزمنية</h2>
            <p className="text-sm text-muted-foreground">
              تُعرض بها كل المواعيد وتُحسب بها حدود «اليوم» و«غداً». تغييرها لا
              يغيّر موعد أي جلسة محفوظة، وإنما طريقة عرضها فقط.
            </p>
          </div>
          <SelectWithLabel
            fieldName="المنطقة الزمنية"
            nameInSchema="timeZone"
            placeholder="اختر المنطقة الزمنية"
            options={toOptions(TIME_ZONE_LABELS)}
          />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">التذكيرات</h2>
            <p className="text-sm text-muted-foreground">
              تحدد هذه التفضيلات متى تصلك رسائل التذكير بالجلسات والمواعيد عبر
              البريد الإلكتروني، وستُستخدم عند تفعيل إرسال التذكيرات.
            </p>
          </div>
          <div className="grid gap-7 md:grid-cols-2">
            <SelectWithLabel
              fieldName="التذكير بالأيام"
              nameInSchema="reminderDays"
              placeholder="اختر عدد الأيام"
              options={toOptions(REMINDER_DAYS_LABELS)}
            />
            <SelectWithLabel
              fieldName="التذكير بالساعات"
              nameInSchema="reminderHours"
              placeholder="اختر عدد الساعات"
              options={toOptions(REMINDER_HOURS_LABELS)}
            />
          </div>
        </section>

        <div className="flex-end">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            className="rounded-sm!"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="size-4 animate-spin" />
            )}
            حفظ الإعدادات
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
