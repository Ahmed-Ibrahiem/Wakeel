import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pulse } from "@/components/shared/Pulse";
import { CaseFormSkeleton } from "@/features/cases/components/CaseFormSkeleton";
import { Briefcase } from "lucide-react";

export default function EditCaseLoading() {
  return (
    <div role="status" className="mx-auto max-w-8xl space-y-6">
      <span className="sr-only">جارٍ التحميل...</span>
      <div className="space-y-3 animate-fade-in">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/dashboard" },
            { label: "القضايا", href: "/dashboard/cases" },
            { label: "إضافة قضية جديدة" },
          ]}
        />
        <PageHeader
          icon={Briefcase}
          title="إضافة قضية جديدة"
          description="أدخل بيانات القضية الأساسية لبدء إدارتها ومتابعتها."
        />
      </div>

      <CaseFormSkeleton />
    </div>
  );
}
