import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Pulse } from "@/components/shared/Pulse";
import { CaseOverviewSkeleton } from "@/features/cases/components/CaseOverviewSkeleton";

export default function CaseDetailsLoading() {
  return (
    <div role="status" className="mx-auto max-w-8xl space-y-3">
      <span className="sr-only">جارٍ التحميل...</span>
      <Breadcrumb
        items={[
          { label: "الرئيسية", href: "/dashboard" },
          { label: "القضايا", href: "/dashboard/cases" },
          { label: "تفاصيل القضية" },
        ]}
      />
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">تفاصيل القضية</h1>
        <Pulse className="h-9 w-20" /> {/* edit button */}
      </header>
      <Pulse className="h-24" /> {/* summary strip */}
      <Pulse className="h-14" /> {/* tabs */}
      <CaseOverviewSkeleton />
    </div>
  );
}
