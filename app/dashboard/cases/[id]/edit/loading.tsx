import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Pulse } from "@/components/shared/Pulse";
import { CaseFormSkeleton } from "@/features/cases/components/CaseFormSkeleton";
import { Briefcase } from "lucide-react";

export default function EditCaseLoading() {
  return (
    <div role="status" className="mx-auto max-w-8xl space-y-6">
      <span className="sr-only">جارٍ التحميل...</span>
      <header className="space-y-3">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/dashboard" },
            { label: "القضايا", href: "/dashboard/cases" },
            { label: "تعديل القضية" },
          ]}
        />
        <div className="flex-start items-start! gap-3">
          <span className="flex-center size-13 shrink-0 rounded-lg bg-secondary text-primary">
            <Briefcase className="size-7" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-bold">تعديل بيانات القضية</h1>
            <Pulse className="mt-1.5 h-4 w-32" /> {/* case number */}
          </div>
        </div>
      </header>

      <CaseFormSkeleton />
    </div>
  );
}
