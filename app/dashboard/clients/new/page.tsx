import { ClientForm } from "@/features/clients/components/ClientForm";
import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";
import { todayIn } from "@/lib/dates";
import { PageHeader } from "@/components/shared/PageHeader";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { UserPlus } from "lucide-react";

export default async function NewClientPage() {
  const { user } = await requireSession();
  const settings = await getUserSettings(user.id);
  const timezone = settings?.timeZone ?? "UTC";

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

      <ClientForm today={todayIn(timezone)} />
    </div>
  );
}
