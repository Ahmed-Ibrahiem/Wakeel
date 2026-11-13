import { notFound } from "next/navigation";
import { CaseForm } from "@/features/cases/components/CaseForm";
import { getCase, listClientOptions } from "@/features/cases/queries";

type Params = Promise<{ id: string }>;

export default async function EditCasePage({ params }: { params: Params }) {
  const { id } = await params;

  // null if it doesn't exist or isn't yours: same result in both cases
  const item = await getCase(id);
  if (!item) notFound();

  const clients = await listClientOptions(item.clientId);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">تعديل بيانات القضية</h1>
        <p className="text-text-body text-lg mt-1.5" >
          {item.caseNumber}
        </p>
      </header>

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