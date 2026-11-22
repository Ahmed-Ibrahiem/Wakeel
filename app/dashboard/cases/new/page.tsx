import Link from "next/link";
import { Briefcase, UserPlus } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { first } from "@/lib/query-utils";
import { CaseForm } from "@/features/cases/components/CaseForm";
import { listClientOptions } from "@/features/cases/queries";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function NewCasePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const clients = await listClientOptions();

  // Preselect a client only if it is in THIS lawyer's own list; anything else is ignored
  const requestedClientId = first((await searchParams).clientId);
  const defaultClientId = clients.some((c) => c.id === requestedClientId)
    ? requestedClientId
    : undefined;

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

      {clients.length === 0 ? (
        // A case always belongs to a client, so the form is useless without one
        <EmptyState
          icon={UserPlus}
          title="أضف عميلاً أولاً"
          description="كل قضية ترتبط بموكّل، لذلك أضف العميل أولاً ثم عُد لإضافة القضية."
        >
          <Link
            href="/dashboard/clients/new?from=case"
            className={buttonVariants({ className: "rounded-sm!" })}
          >
            إضافة عميل
          </Link>
        </EmptyState>
      ) : (
        <CaseForm clients={clients} defaultClientId={defaultClientId} />
      )}
    </div>
  );
}
