import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Pencil } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";
import { first } from "@/lib/query-utils";
import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";
import { getCase } from "@/features/cases/queries";
import { caseTabSchema } from "@/features/cases/tabs";
import { CaseOverview } from "@/features/cases/components/CaseOverview";
import { CaseSummaryStrip } from "@/features/cases/components/CaseSummaryStrip";
import { CaseTabs } from "@/features/cases/components/CaseTabs";
import { HearingsSection } from "@/features/hearings/components/HearingsSection";
import { DeadlinesSection } from "@/features/deadlines/components/DeadlinesSection";
import { CaseOverviewSkeleton } from "@/features/cases/components/CaseOverviewSkeleton";
import { CaseRowActions } from "@/features/cases/components/CaseRowActions";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const sectionFallback = (
  <div className="h-32 animate-pulse rounded-sm border bg-muted/40" />
);

export default async function CaseDetailsPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;

  const item = await getCase(id);
  if (!item) notFound();

  const tab = caseTabSchema.parse(first((await searchParams).tab));

  const { user } = await requireSession();
  const { timeZone } = await getUserSettings(user.id);

  return (
    <div className="mx-auto max-w-8xl space-y-3">
      <Breadcrumb
        items={[
          { label: "الرئيسية", href: "/dashboard" },
          { label: "القضايا", href: "/dashboard/cases" },
          { label: "تفاصيل القضية" },
        ]}
      />

      <header className="flex flex-wrap items-center justify-between gap-3 animate-fade-in">
        <div className="flex-start flex-wrap gap-3">
          <h1 className="text-2xl font-bold">تفاصيل القضية</h1>
          {item.archivedAt && (
            <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700">
              مؤرشفة
            </span>
          )}
        </div>

        <div className="flex-start gap-2">
          <Button asChild className="rounded-sm! text-sm h-9">
            <Link href={`/dashboard/cases/${item.id}/edit`}>
              <Pencil className="size-4" />
              تعديل
            </Link>
          </Button>
          <CaseRowActions
            id={item.id}
            number={item.caseNumber}
            archived={Boolean(item.archivedAt)}
            redirectAfterDelete="/dashboard/cases"
          />
        </div>
      </header>

      <CaseSummaryStrip
        caseNumber={item.caseNumber}
        caseType={item.caseType}
        courtName={item.courtName}
        opposingParty={item.opposingParty}
        createdAt={item.createdAt}
        timeZone={timeZone}
      />

      <CaseTabs caseId={item.id} active={tab} />

      {tab === "overview" && (
        <Suspense fallback={<CaseOverviewSkeleton />}>
          <CaseOverview item={item} timeZone={timeZone} />
        </Suspense>
      )}

      {tab === "hearings" && (
        <Suspense fallback={sectionFallback}>
          <HearingsSection caseId={item.id} />
        </Suspense>
      )}

      {tab === "deadlines" && (
        <Suspense fallback={sectionFallback}>
          <DeadlinesSection caseId={item.id} />
        </Suspense>
      )}

      {tab === "notes" && (
        <section className="rounded-sm border bg-background p-6">
          <h2 className="mb-3 text-lg font-bold">الملاحظات</h2>
          {item.notes ? (
            // React escapes text; whitespace-pre-wrap keeps the line breaks
            <p className="whitespace-pre-wrap text-sm">{item.notes}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              لا توجد ملاحظات لهذه القضية.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
