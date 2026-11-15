import Link from "next/link";
import { AlertTriangle, CalendarDays, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { toZonedParts } from "@/lib/zoned-time";
import { HEARING_TYPE_LABELS } from "@/features/hearings/labels";
import {
  dashboardStats,
  scheduleHearings,
  undecidedHearings,
} from "../queries";
import { flagConflicts } from "../schedule";

const ROW_GRID =
  "grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,0.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center lg:gap-4";

export function PanelSkeleton() {
  return <div className="h-56 animate-pulse rounded-sm border bg-muted/40" />;
}

export async function ScheduleSection() {
  const [{ items, timeZone, todayEnd }, undecided, stats] = await Promise.all([
    scheduleHearings(),
    undecidedHearings(),
    dashboardStats(),
  ]);
  const conflicts = flagConflicts(items);
  const moreUndecided = stats.undecidedHearings - undecided.items.length;

  return (
    <section className="space-y-4 rounded-sm border bg-background p-4">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <CalendarDays className="size-5 text-primary" aria-hidden />
        جلسات اليوم وغداً
      </h2>

      {undecided.items.length > 0 && (
        <div className="space-y-2 rounded-sm border border-amber-200 bg-amber-50 p-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-800">
            <AlertTriangle className="size-4" aria-hidden />
            جلسات تحتاج تسجيل قرار ({stats.undecidedHearings})
          </h3>
          <ul className="space-y-1">
            {undecided.items.map((h) => {
              const { date } = toZonedParts(h.hearingAt, undecided.timeZone);
              return (
                <li key={h.id}>
                  <Link
                    href={`/dashboard/cases/${h.caseId}`}
                    className="flex flex-wrap items-center gap-x-3 text-sm hover:text-primary"
                  >
                    <span className="font-medium" dir="ltr">
                      {h.caseNumber}
                    </span>
                    <span className="text-muted-foreground">
                      {h.clientName}
                    </span>
                    <span className="text-xs text-amber-800" dir="ltr">
                      {date}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {moreUndecided > 0 && (
            <p className="text-xs text-amber-800">و {moreUndecided} أخرى</p>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground max-w-full">
          لا يوجد جلسات هذا اليوم او غدا.
        </p>
      ) : (
        <div>
          <div
            className={cn(
              ROW_GRID,
              "hidden px-3 pb-2 text-xs text-muted-foreground lg:grid lg:grid-cols-6",
            )}
          >
            <span>القضية / العميل</span>
            <span>الوقت</span>
            <span>نوع الجلسة</span>
            <span>المحكمة</span>
            <span>ملاحظات</span>
            <span />
          </div>

          <ul className="space-y-2">
            {items.map((h) => {
              const { date, time } = toZonedParts(h.hearingAt, timeZone);
              const isToday = h.hearingAt.getTime() < todayEnd.getTime();

              return (
                <li key={h.id}>
                  <Link
                    href={`/dashboard/cases/${h.caseId}`}
                    className={cn(
                      ROW_GRID,
                      "rounded-sm border p-3 hover:border-primary/40 lg:grid lg:grid-cols-6",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <UserRound
                        className="size-5 shrink-0 text-primary"
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold" >
                          {h.caseNumber}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {h.clientName}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium tabular-nums" >
                        {time}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isToday ? "اليوم" : "غداً"}{" "}
                        <span dir="ltr">{date}</span>
                      </p>
                    </div>

                    <p className="text-sm">{HEARING_TYPE_LABELS[h.type]}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {h.courtName}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {h.notes ?? "—"}
                    </p>

                    <div className="lg:justify-self-end">
                      {conflicts.has(h.id) && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                          <AlertTriangle className="size-3" aria-hidden />
                          تعارض مواعيد محتمل
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
