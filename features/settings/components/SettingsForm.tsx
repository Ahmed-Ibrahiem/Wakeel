"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BellRing,
  CalendarDays,
  Clock,
  Globe,
  Info,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { FormSection } from "@/components/shared/FormSection";
import { updateSettings } from "../actions";
import {
  DEFAULT_SETTINGS,
  settingsFormSchema,
  type SettingsFormValues,
} from "../schemas";
import {
  REMINDER_DAYS_LABELS,
  REMINDER_HOURS_LABELS,
  TIME_ZONE_LABELS,
} from "../labels";

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([id, label]) => ({ id, label }));

export function SettingsForm({
  initialValues,
  timeZoneOffsets,
}: {
  initialValues: SettingsFormValues;
  // "Africa/Cairo" -> "UTC+02:00", computed on the server (DST-aware)
  timeZoneOffsets: Record<string, string>;
}) {
  const router = useRouter();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: initialValues,
  });

  const { isSubmitting, isDirty } = form.formState;
  const [timeZone, reminderDays, reminderHours] = useWatch({
    control: form.control,
    name: ["timeZone", "reminderDays", "reminderHours"],
  });

  const isDefault =
    timeZone === DEFAULT_SETTINGS.timeZone &&
    reminderDays === DEFAULT_SETTINGS.reminderDays &&
    reminderHours === DEFAULT_SETTINGS.reminderHours;

  const onSubmit = async (values: SettingsFormValues) => {
    const result = await updateSettings(values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("تم حفظ الإعدادات");
    // The saved values become the new baseline, so the save button is disabled until the next change
    form.reset(values);
    // Re-renders the page so the "last updated" line shows the new time
    router.refresh();
  };

  // Only fills the fields. Nothing is saved until the user presses save.
  // keepDefaultValues keeps the last saved values as the baseline for isDirty.
  const onResetToDefaults = () =>
    form.reset(DEFAULT_SETTINGS, { keepDefaultValues: true });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <FormSection title="إعدادات التذكير" icon={BellRing}>
          <p className="mb-5 text-sm text-muted-foreground">
            حدد متى تصلك رسائل التذكير بالجلسات والمواعيد النهائية.
          </p>
          <div className="grid gap-7 md:grid-cols-2">
            <SelectWithLabel<SettingsFormValues>
              fieldName="التذكير قبل الجلسة أو الموعد النهائي بـ"
              nameInSchema="reminderDays"
              placeholder="اختر عدد الأيام"
              icon={CalendarDays}
              options={toOptions(REMINDER_DAYS_LABELS)}
            />
            <SelectWithLabel<SettingsFormValues>
              fieldName="تذكير إضافي قبل الجلسة بـ"
              nameInSchema="reminderHours"
              placeholder="اختر عدد الساعات"
              icon={Clock}
              options={toOptions(REMINDER_HOURS_LABELS)}
            />
          </div>
          <p className="mt-5 flex items-start gap-2 rounded-sm bg-secondary p-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span>
              سيتم إرسال التذكيرات إلى بريدك الإلكتروني المسجل، وتصل تذكيرات
              الأيام من الساعة 8 صباحاً بتوقيتك.
            </span>
          </p>
        </FormSection>

        <FormSection title="المنطقة الزمنية" icon={Globe}>
          <p className="mb-5 text-sm text-muted-foreground">
            تُعرض بها كل المواعيد وتُحسب بها حدود «اليوم» و«غداً». تغييرها لا
            يغيّر موعد أي جلسة محفوظة، وإنما طريقة عرضها فقط.
          </p>
          <div className="max-w-md space-y-2">
            <SelectWithLabel<SettingsFormValues>
              fieldName="المنطقة الزمنية"
              nameInSchema="timeZone"
              placeholder="اختر المنطقة الزمنية"
              icon={Globe}
              options={toOptions(TIME_ZONE_LABELS)}
            />
            <p className="text-sm text-muted-foreground">
              {TIME_ZONE_LABELS[timeZone]} —{" "}
              <bdi dir="ltr">{timeZoneOffsets[timeZone]}</bdi>
            </p>
          </div>
        </FormSection>

        <div className="flex-start gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="rounded-sm!"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            حفظ التغييرات
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting || isDefault}
            onClick={onResetToDefaults}
            className="rounded-sm!"
          >
            <RotateCcw className="size-4" />
            إعادة ضبط
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
