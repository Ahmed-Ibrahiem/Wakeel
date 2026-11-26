import Link from "next/link";
import { Briefcase, ChevronLeft, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/relative-time";
import { CASES_BASE } from "@/features/cases/url";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_STYLES,
} from "@/features/cases/labels";
import { recentCases } from "../queries";

export async function RecentCases() {
  const items = await recentCases();

  return (
    <section className="animate-fade-in flex-col-start gap-2 rounded-sm border bg-background p-4">
      <div className="flex-between gap-3 w-full">
        <h2 className="flex-start gap-2 text-lg font-bold">
          <FileText className="size-5 text-primary" aria-hidden />
          آخر القضايا المحدّثة
        </h2>
        <Link
          href={CASES_BASE}
          className="flex-start gap-1 text-sm text-primary hover:underline"
        >
          عرض الكل
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex-col-center gap-3 w-full text-muted-foreground grow">
          <Briefcase className="size-8" />
          <div className="w-full flex-col-center">
            <p className="text-center text-sm ">لا يوجد قضايا حتي الأن. </p>
            <Link href={`${CASES_BASE}/new`} className="text-primary underline">
              أضف أول قضية
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y xl:max-h-full xl:h-40 xl:overflow-y-auto pe-1.5 w-full">
          {items.map((c) => (
            <li key={c.id}>
              <Link
                href={`${CASES_BASE}/${c.id}`}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 hover:text-primary"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold">{c.caseNumber}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.clientName} · {c.courtName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      CASE_STATUS_STYLES[c.status],
                    )}
                  >
                    {CASE_STATUS_LABELS[c.status] ?? c.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(c.updatedAt)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
