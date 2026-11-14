import { cn } from "@/lib/utils";
import { Briefcase, CalendarDays, ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_STYLES,
  CASE_TYPE_LABELS,
} from "../labels";
import { CaseRowActions } from "./CaseRowActions";

type CaseItem = {
  id: string;
  clientName: string;
  caseNumber: string;
  caseType: string;
  courtName: string;
  status: string;
  judgmentDate: string | null;
  updatedAt: Date;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium wrap-break-word">{value}</p>
    </div>
  );
}

export function CaseCard({
  item,
  archived,
  timezone,
}: {
  item: CaseItem;
  archived: boolean;
  timezone: string;
}) {
  // en-CA gives YYYY-MM-DD, in the lawyer's own time zone
  const updated = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
  }).format(item.updatedAt);
  const footerLabel = item.judgmentDate ? "تاريخ الحكم" : "آخر تحديث";
  const footerDate = item.judgmentDate ?? updated;

  return (
    <article className="flex flex-col overflow-hidden rounded-sm border bg-background">
      <div className="flex-1 space-y-2.5 p-3.5">
        {/* header */}
        <div className="flex-between gap-2">
          <div className="flex items-center gap-2">
            <Briefcase className="size-5 text-primary" aria-hidden />
            <div>
              <p className="text-xs text-muted-foreground">رقم القضية</p>
              <p className="font-bold" dir="ltr">
                {item.caseNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                CASE_STATUS_STYLES[item.status],
              )}
            >
              {CASE_STATUS_LABELS[item.status] ?? item.status}
            </span>
            <CaseRowActions
              id={item.id}
              number={item.caseNumber}
              archived={archived}
            />
          </div>
        </div>

        <Field label="العميل" value={item.clientName} />
        <Field
          label="نوع القضية"
          value={CASE_TYPE_LABELS[item.caseType] ?? item.caseType}
        />
        <Field label="المحكمة" value={item.courtName} />
      </div>

      {/* Footer */}
      <div className="flex-between w-full gap-5 flex-wrap border-t px-4 py-2">
        <div className="flex-start gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-4" aria-hidden />
          <span>{footerLabel}</span>
          <span className="tabular-nums">{footerDate}</span>
        </div>
        <Link
          href={`/dashboard/cases/${item.id}`}
          className="flex-start gap-1 text-sm font-medium text-text-body hover:text-primary"
        >
          عرض التفاصيل
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
