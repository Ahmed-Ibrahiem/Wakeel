import Link from "next/link";
import { Archive, Briefcase, Plus, SearchX } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";
import { casesList } from "@/features/cases/queries";
import { CASES_BASE, casesHref } from "@/features/cases/url";
import { CasesSearch } from "@/features/cases/components/CasesSearch";
import { CasesFilters } from "@/features/cases/components/CasesFilters";
import { CaseCard } from "@/features/cases/components/CaseCard";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const CasesPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { items, q, page, pageSize, total, totalPages, status, archived } =
    await casesList(await searchParams);

  const { user } = await requireSession();
  const settings = await getUserSettings(user.id);
  const timezone = settings?.timeZone ?? "UTC";

  const hrefFor = (p: number) =>
    casesHref({ q, status, archived, pageSize, page: p });

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function emptyState() {
    if (q || status !== "all") {
      return (
        <EmptyState
          icon={SearchX}
          title="لا توجد نتائج"
          description={
            q ? `لم نجد قضايا تطابق «${q}»` : "لا توجد قضايا بهذه الحالة"
          }
        >
          <Link
            href={casesHref({ archived })}
            className={buttonVariants({ variant: "secondary" })}
          >
            مسح البحث والفلتر
          </Link>
        </EmptyState>
      );
    }
    if (archived) {
      return (
        <EmptyState
          icon={Archive}
          title="لا توجد قضايا مؤرشفة"
          description="القضايا اللي تؤرشفها ستظهر هنا، وتستطيع إرجاعها في أي وقت."
        />
      );
    }
    return (
      <EmptyState
        icon={Briefcase}
        title="لا توجد قضايا بعد"
        description="ابدأ بإضافة أول قضية، وبعدها ستجد جلساتها ومواعيدها هنا."
      >
        <Button asChild>
          <Link href={`${CASES_BASE}/new`}>إضافة أول قضية</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-2.5">
      <header className="flex-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">القضايا</h1>
          <p className="text-sm text-muted-foreground">
            إدارة جميع القضايا الخاصة بك
          </p>
        </div>
      </header>

      <div className="w-full flex-between gap-5 flex-wrap bg-white p-2.5 border rounded-sm">
        <CasesSearch q={q} />
        <Button className="rounded-sm!" asChild>
          <Link href={`${CASES_BASE}/new`}>
            <Plus className="size-4 mt-1" />
            قضية جديدة
          </Link>
        </Button>
      </div>

      <CasesFilters q={q} status={status} archived={archived} />

      {total === 0 ? (
        emptyState()
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {items.map((item) => (
              <CaseCard
                key={item.id}
                item={item}
                archived={archived}
                timezone={timezone}
              />
            ))}
          </div>

          <div className="flex-col-center gap-3 sm:flex-row sm:justify-between rounded-sm border bg-background p-2.5">
            <p className="text-sm text-muted-foreground">
              عرض {from} - {to} من {total} قضية
            </p>
            <Pagination
              page={page}
              totalPages={totalPages}
              hrefFor={hrefFor}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CasesPage;