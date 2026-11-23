import { Settings } from "lucide-react";
import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";
import { formatLongDate, formatTime } from "@/lib/format-date";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { SettingsForm } from "@/features/settings/components/SettingsForm";
import { getTimeZoneOffsets } from "@/features/settings/timezone-offsets";
import {
  DEFAULT_SETTINGS,
  REMINDER_DAYS,
  REMINDER_HOURS,
  TIME_ZONES,
  type SettingsFormValues,
} from "@/features/settings/schemas";
import { hasPasswordLogin } from "@/features/account/queries";
import { ChangePasswordForm } from "@/features/account/components/ChangePasswordForm";
import { DeleteAccountSection } from "@/features/account/components/DeleteAccountSection";

// A stored value outside the allowed list falls back to a default instead of an empty Select
function pick<T extends readonly string[]>(
  options: T,
  value: string,
  fallback: T[number],
): T[number] {
  return (options as readonly string[]).includes(value)
    ? (value as T[number])
    : fallback;
}

const SettingsPage = async () => {
  const { user } = await requireSession();
  const [settings, hasPassword] = await Promise.all([
    getUserSettings(user.id),
    hasPasswordLogin(user.id),
  ]);

  const initialValues: SettingsFormValues = {
    timeZone: pick(TIME_ZONES, settings.timeZone, DEFAULT_SETTINGS.timeZone),
    reminderDays: pick(
      REMINDER_DAYS,
      String(settings.reminderDaysBefore),
      DEFAULT_SETTINGS.reminderDays,
    ),
    reminderHours: pick(
      REMINDER_HOURS,
      String(settings.reminderHoursBefore),
      DEFAULT_SETTINGS.reminderHours,
    ),
  };

  // Shown in the lawyer's own saved time zone
  const updatedAt = new Date(settings.updatedAt);
  const lastUpdated = `${formatLongDate(updatedAt, initialValues.timeZone)}، ${formatTime(updatedAt, initialValues.timeZone)}`;

  return (
    <div className="animate-fade-in mx-auto max-w-8xl space-y-5">
      <Breadcrumb
        items={[
          { label: "الرئيسية", href: "/dashboard" },
          { label: "الإعدادات" },
        ]}
      />
      <PageHeader
        icon={Settings}
        title="الإعدادات"
        description="خصص المنطقة الزمنية وأدر أمان حسابك"
      />

      <SettingsForm
        initialValues={initialValues}
        timeZoneOffsets={getTimeZoneOffsets()}
      />

      <p className="text-xs text-muted-foreground">
        آخر تحديث للإعدادات: {lastUpdated}
      </p>

      <ChangePasswordForm hasPassword={hasPassword} />

      <DeleteAccountSection hasPassword={hasPassword} />
    </div>
  );
};

export default SettingsPage;
