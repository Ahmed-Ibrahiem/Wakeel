import { CaseForm } from "@/features/cases/components/CaseForm";
import { listClientOptions } from "@/features/cases/queries";

export default async function NewCasePage() {
  const clients = await listClientOptions();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">قضية جديدة</h1>
        <p className="text-sm text-muted-foreground">
          أضف بيانات القضية الأساسية، وتقدر تعدّلها بعدين.
        </p>
      </header>

      <CaseForm clients={clients} />
    </div>
  );
}