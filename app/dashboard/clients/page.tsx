import { ClientsSearch } from "@/feature/clients/components/ClientsSearch";
import { ClientsTable } from "@/feature/clients/components/ClientsTables";
import { clientsList } from "@/feature/clients/queries";
import { Pagination } from "@/components/shared/Pagination";
import { DEFAULT_PAGE_SIZE } from "@/feature/clients/schemas";
import Link from "next/link";
import { SearchX, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const ClientsPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { items, q, page, pageSize, total, totalPages } = await clientsList(
    await searchParams,
  );

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (pageSize !== DEFAULT_PAGE_SIZE)
      params.set("pageSize", String(pageSize));
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/dashboard/clients?${qs}` : "/dashboard/clients";
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="space-y-2.5">
      <header>
        <h1 className="text-2xl font-bold">العملاء</h1>
        <p className="text-sm text-muted-foreground">
          إدارة بيانات العملاء بشكل منظم وسهل
        </p>
      </header>

      <ClientsSearch q={q} />

      {total === 0 ? (
        q ? (
          <EmptyState
            icon={SearchX}
            title="لا توجد نتائج"
            description={`لم نجد عملاء يطابقون «${q}»`}
          >
            <Link
              href="/dashboard/clients"
              className={buttonVariants({
                variant: "secondary",
                className: "border! border-border! hover:border-primary/50!",
              })}
            >
              مسح البحث
            </Link>
          </EmptyState>
        ) : (
          <EmptyState
            icon={Users}
            title="لا يوجد عملاء بعد"
            description="ابدأ بإضافة أول عميل لك، وبعدها ستجد قضاياه وجلساته هنا."
          />
        )
      ) : (
        <>
          <div className="rounded-sm border bg-background overflow-hidden p-2.5 ">
            <ClientsTable clients={items} />

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
