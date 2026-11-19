import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";
import { getClient } from "@/features/clients/queries";
import { getClientStats } from "@/features/clients/stats";
import { listClientCases } from "@/features/cases/queries";
import { ClientCasesSection } from "@/features/clients/components/ClientCasesSection";
import { ClientProfileCard } from "@/features/clients/components/ClientProfileCard";
import { ClientRowActions } from "@/features/clients/components/ClientRowActions";
import { ClientStats } from "@/features/clients/components/ClientStats";
import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";

type Params = Promise<{ id: string }>;

export default async function ClientDetailsPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  // Independent queries run together; both filter by the session's user id,
  // so another lawyer's client gives null and an empty list
  const [client, cases, { timeZone }] = await Promise.all([
    getClient(id),
    listClientCases(id),
    requireSession().then(({ user }) => getUserSettings(user.id)),
  ]);
  if (!client) notFound(); // missing and "not yours" look exactly the same

  const stats = getClientStats(cases);
  const archived = Boolean(client.archivedAt);

  return (
    <div className="mx-auto max-w-8xl animate-fade-in space-y-5">
      <Breadcrumb
        items={[
          { label: "الرئيسية", href: "/dashboard" },
          { label: "العملاء", href: "/dashboard/clients" },
          { label: "تفاصيل العميل" },
        ]}
      />

      <header className="flex-start flex-wrap gap-3">
        <h1 className="text-2xl font-bold">تفاصيل العميل</h1>
        <Button asChild className="rounded-sm!">
          <Link href={`/dashboard/clients/${client.id}/edit`}>
            <Pencil className="size-4" />
            تعديل بيانات العميل
          </Link>
        </Button>
        <div className="flex-start rounded-sm border bg-background p-0.5">
          <ClientRowActions
            id={client.id}
            name={client.fullName}
            archived={archived}
            afterDeleteHref="/dashboard/clients"
          />
        </div>
      </header>

      <ClientProfileCard
        fullName={client.fullName}
        phone={client.phone}
        email={client.email}
        address={client.address}
        firstContactDate={client.firstContactDate}
        archived={archived}
        isActive={stats.isActive}
      />

      <ClientStats
        total={stats.total}
        ongoing={stats.ongoing}
        latestCaseNumber={stats.latestCaseNumber}
      />

      {/* Temporary: replaced by the cases table in step 2 (it fetches the cases again for now) */}
      <ClientCasesSection cases={cases} timeZone={timeZone} />
    </div>
  );
}
