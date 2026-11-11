import { ClientsSearch } from "@/features/clients/components/ClientsSearch";
import { ClientsTable } from "@/features/clients/components/ClientsTables";
import { clientsList } from "@/features/clients/queries";
import { Pagination } from "@/components/shared/Pagination";
import { DEFAULT_PAGE_SIZE } from "@/features/clients/schemas";
import Link from "next/link";
import { SearchX, Users, Plus, Archive } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ClientsTabs } from "@/features/clients/components/ClientsTabs";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const BASE = "/dashboard/clients";

const ClientsPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { items, q, page, pageSize, total, totalPages, archived } =
    await clientsList(await searchParams);

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (archived) params.set("archived", "1");
    if (q) params.set("q", q);
    if (pageSize !== DEFAULT_PAGE_SIZE)
      params.set("pageSize", String(pageSize));
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${BASE}?${qs}` : BASE;
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function emptyState() {
    if (q) {
      return (
        <EmptyState
          icon={SearchX}
          title="لا توجد نتائج"
          description={`لم نجد عملاء يطابقون «${q}»`}
        >
          <Link
            href={archived ? `${BASE}?archived=1` : BASE}
            className={buttonVariants({ variant: "outline" })}
          >
            مسح البحث
          </Link>
        </EmptyState>
      );
    }
    if (archived) {
      return (
        <EmptyState
          icon={Archive}
          title="لا يوجد عملاء مؤرشفون"
          description="العملاء اللي تؤرشفهم سيظهرون هنا، وتستطيع إرجاعهم في أي وقت."
        />
      );
    }
    return (
      <EmptyState
        icon={Users}
        title="لا يوجد عملاء بعد"
        description="ابدأ بإضافة أول عميل لك، وبعدها ستجد قضاياه وجلساته هنا."
      >
        <Button asChild>
          <Link href={`${BASE}/new`}>إضافة أول عميل</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-2.5">
      <header className="flex-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">العملاء</h1>
          <p className="text-sm text-muted-foreground">
            إدارة بيانات العملاء بشكل منظم وسهل
          </p>
        </div>
      </header>

      <div className="w-full flex-between gap-5 flex-wrap bg-white p-2.5 border rounded-sm">
        <ClientsSearch q={q} />

        <div className="flex-start gap-5 flex-wrap">
          <ClientsTabs archived={archived} />

          <Button className="rounded-sm!" asChild>
            <Link href={`${BASE}/new`}>
              <Plus className="size-4 mt-1" />
              عميل جديد
            </Link>
          </Button>
        </div>
      </div>

      {total === 0 ? (
        emptyState()
      ) : (
        <>
          <div className="rounded-sm border bg-background overflow-hidden p-2.5 ">
            <ClientsTable archived={archived} clients={items} />

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="text-sm text-muted-foreground">
                عرض {from} - {to} من {total} عميل
              </p>
              <Pagination
                page={page}
                totalPages={totalPages}
                hrefFor={hrefFor}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientsPage;
