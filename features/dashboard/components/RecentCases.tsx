import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";
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
    <section className="space-y-3 rounded-sm border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <FileText className="size-5 text-primary" aria-hidden />
          آخر القضايا المحدّثة
        </h2>
        <Link
          href={CASES_BASE}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          عرض الكل
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          لا يوجد قضايا حتي الأن.{" "}
          <Link href={`${CASES_BASE}/new`} className="text-primary underline">
            أضف أول قضية
          </Link>
        </p>
      ) : (
        <ul className="divide-y lg:max-h-39 lg:overflow-y-auto pe-1.5">
          {items.map((c) => (
            <li key={c.id}>
              <Link
                href={`${CASES_BASE}/${c.id}`}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 hover:text-primary"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold" >
                    {c.caseNumber}
                  </p>
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