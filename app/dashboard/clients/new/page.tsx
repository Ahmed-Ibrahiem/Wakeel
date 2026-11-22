import { ClientForm } from "@/features/clients/components/ClientForm";
import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";
import { todayIn } from "@/lib/dates";
import { PageHeader } from "@/components/shared/PageHeader";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { UserPlus } from "lucide-react";
import { first } from "@/lib/query-utils";
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { user } = await requireSession();
  const settings = await getUserSettings(user.id);
  const timezone = settings?.timeZone ?? "UTC";

  // Only the exact value "case" counts: it is a flag, never a URL to redirect to
  const fromCase = first((await searchParams).from) === "case";

  return (
    <div className="mx-auto max-w-8xl space-y-5">
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/dashboard" },
            { label: "العملاء", href: "/dashboard/clients" },
            { label: "إضافة عميل جديدة" },
          ]}
        />
        <PageHeader
          icon={UserPlus}
          title="إضافة عميل جديدة"
          description="ادخل بيانات العميل لبدء ادارة قضاياه."
        />
      </div>

      <ClientForm today={todayIn(timezone)} fromCase={fromCase} />
    </div>
  );
}
