import { UserPen } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { ClientFormSkeleton } from "@/features/clients/components/ClientFormSkeleton";

export default function EditClientLoading() {
  return (
    <div role="status" className="mx-auto max-w-8xl space-y-6">
      <span className="sr-only">جارٍ التحميل...</span>
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/dashboard" },
            { label: "العملاء", href: "/dashboard/clients" },
            { label: "تعديل بيانات العميل" },
          ]}
        />
        <PageHeader icon={UserPen} title="تعديل بيانات العميل" />
      </div>

      <ClientFormSkeleton />
    </div>
  );
}