import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";
import { SettingsForm } from "@/features/settings/components/SettingsForm";
import {
  REMINDER_DAYS,
  REMINDER_HOURS,
  TIME_ZONES,
  type SettingsFormValues,
} from "@/features/settings/schemas";

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
  const settings = await getUserSettings(user.id);

  const initialValues: SettingsFormValues = {
    timeZone: pick(TIME_ZONES, settings.timeZone, "Africa/Cairo"),
    reminderDays: pick(REMINDER_DAYS, String(settings.reminderDaysBefore), "1"),
    reminderHours: pick(
      REMINDER_HOURS,
      String(settings.reminderHoursBefore),
      "3",
    ),
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-sm text-muted-foreground">
          اضبط المنطقة الزمنية ومواعيد التذكير بما يناسبك
        </p>
      </header>

      <SettingsForm initialValues={initialValues} />
    </div>
  );
};

export default SettingsPage;
