import { notFound } from "next/navigation";
import { CaseForm } from "@/features/cases/components/CaseForm";
import { getCase, listClientOptions } from "@/features/cases/queries";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { PageHeader } from "@/components/shared/PageHeader";
import { Briefcase } from "lucide-react";

type Params = Promise<{ id: string }>;

export default async function EditCasePage({ params }: { params: Params }) {
  const { id } = await params;

  // null if it doesn't exist or isn't yours: same result in both cases
  const item = await getCase(id);
  if (!item) notFound();

  const clients = await listClientOptions(item.clientId);

  return (
    <div className="mx-auto max-w-8xl space-y-6">

      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/dashboard" },
            { label: "القضايا", href: "/dashboard/cases" },
            { label: "تعديل القضية" },
          ]}
        />
        <PageHeader
          icon={Briefcase}
          title="تعديل بيانات القضية"
          description={item.caseNumber}
        />
      </div>

      <CaseForm
        clients={clients}
        caseId={item.id}
        initialValues={{
          clientId: item.clientId,
          caseNumber: item.caseNumber,
          caseType: item.caseType,
          courtName: item.courtName,
          opposingParty: item.opposingParty ?? "",
          status: item.status,
          judgmentDate: item.judgmentDate ?? "",
          notes: item.notes ?? "",
        }}
      />
    </div>
  );
}
