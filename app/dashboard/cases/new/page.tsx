import { Briefcase } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { CaseForm } from "@/features/cases/components/CaseForm";
import { listClientOptions } from "@/features/cases/queries";

export default async function NewCasePage() {
  const clients = await listClientOptions();

  return (
    <div className="mx-auto space-y-5">
      <div className="space-y-3">
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

      <CaseForm clients={clients} />
    </div>
  );
}
