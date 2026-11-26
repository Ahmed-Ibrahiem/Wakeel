import { cn } from "@/lib/utils";
import { Briefcase, CalendarDays, ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_STYLES,
  CASE_TYPE_LABELS,
} from "../labels";
import { getCaseSignals } from "../signals";
import { CaseRowActions } from "./CaseRowActions";

type CaseItem = {
  id: string;
  clientName: string;
  caseNumber: string;
  caseType: string;
  courtName: string;
  status: string;
  judgmentDate: string | null;
  archivedAt: Date | null;
  updatedAt: Date;
  nextHearingAt: Date | null;
  lastHearingAt: Date | null;
  nextDeadlineDate: string | null;
};

function Field({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-sm font-medium wrap-break-word line-clamp-1",
          danger && "text-red-700",
        )}
      >
        {value}
      </p>
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
  const { urgent, footer, deadline } = getCaseSignals(item, timezone);

  return (
    <article className="flex flex-col overflow-hidden rounded-sm border bg-background">
      <div className="flex-1 space-y-2.5 p-3.5 py-2.5!">
        {/* header */}
        <div className="flex-between gap-2">
          <div className="flex items-center gap-2">
            <Briefcase className="size-5 text-primary" aria-hidden />
            <div>
              <p className="text-xs text-muted-foreground">رقم القضية</p>
              <p className="font-bold line-clamp-1" dir="ltr">
                {item.caseNumber}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1">
            {urgent && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                عاجلة
              </span>
            )}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5  ">
          <div className="flex-col-start gap-1.5">
            <Field label="العميل" value={item.clientName} />
            <Field
              label="نوع القضية"
              value={CASE_TYPE_LABELS[item.caseType] ?? item.caseType}
            />
            <Field label="المحكمة" value={item.courtName} />
          </div>
          {deadline && (
            <Field
              label={deadline.overdue ? "موعد نهائي متأخر" : "أقرب موعد نهائي"}
              value={deadline.date}
              danger={deadline.overdue}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-between w-full gap-5 flex-wrap border-t px-4 py-2 min-h-14">
        <div
          className={cn(
            "flex-start gap-2 text-xs text-muted-foreground",
            footer.warning && "text-amber-700",
          )}
        >
          <CalendarDays className="size-4" aria-hidden />
          <div className="flex-col-start gap-1">
            <span>{footer.label}</span>
            {footer.date && (
              <span className="tabular-nums" dir="ltr">
                {footer.date}
              </span>
            )}
          </div>
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
