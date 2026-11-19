import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Pulse } from "@/components/shared/Pulse";

export default function ClientDetailsLoading() {
  return (
    <div role="status" className="mx-auto max-w-8xl space-y-5">
      <span className="sr-only">جارٍ التحميل...</span>
      <Breadcrumb
        items={[
          { label: "الرئيسية", href: "/dashboard" },
          { label: "العملاء", href: "/dashboard/clients" },
          { label: "تفاصيل العميل" },
        ]}
      />
      <header className="flex-start flex-wrap gap-3">
        <h1 className="text-2xl font-bold">تفاصيل العميل</h1>
        <Pulse className="h-9 w-44" />
        <Pulse className="h-9 w-20" />
      </header>
      <Pulse className="h-28" /> {/* profile card */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Pulse className="h-24" />
        <Pulse className="h-24" />
        <Pulse className="h-24" />
      </div>
      <Pulse className="h-96" /> {/* cases table */}
    </div>
  );
}
