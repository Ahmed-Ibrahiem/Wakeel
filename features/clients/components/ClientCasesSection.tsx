import { Briefcase } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";
import { listClientCases } from "@/features/cases/queries";
import { CaseCard } from "@/features/cases/components/CaseCard";

export async function ClientCasesSection({ clientId }: { clientId: string }) {
  const { user } = await requireSession();

  const [items, settings] = await Promise.all([
    listClientCases(clientId),
    getUserSettings(user.id),
  ]);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold">القضايا ({items.length})</h2>

      {items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="لا توجد قضايا لهذا العميل"
          description="عند إضافة قضية لهذا العميل ستظهر هنا."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <CaseCard
              key={item.id}
              item={item}
              archived={Boolean(item.archivedAt)}
              timezone={settings.timeZone}
            />
          ))}
        </div>
      )}
    </section>
  );
}