import { ClientForm } from "@/features/clients/components/ClientForm";
import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";
import { todayIn } from "@/lib/dates";

export default async function NewClientPage() {
  const { user } = await requireSession();
  const settings = await getUserSettings(user.id);
  const timezone = settings?.timeZone ?? "UTC";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">عميل جديد</h1>
        <p className="text-sm text-muted-foreground">
          أضف بيانات العميل الأساسية، وتقدر تعدّلها بعدين.
        </p>
      </header>

      <ClientForm today={todayIn(timezone)} />
    </div>
  );
}
