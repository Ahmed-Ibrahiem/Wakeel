import { UserPlus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { ClientFormSkeleton } from "@/features/clients/components/ClientFormSkeleton";

export default function NewClientLoading() {
  return (
    <div role="status" className="mx-auto max-w-8xl space-y-5">
      <span className="sr-only">جارٍ التحميل...</span>
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

      <ClientFormSkeleton />
    </div>
  );
}