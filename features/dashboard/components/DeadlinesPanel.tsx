import Link from "next/link";
import { AlarmClock, FilePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysBetween } from "@/lib/dates";
import { CASES_BASE } from "@/features/cases/url";
import { dashboardStats, upcomingDeadlines } from "../queries";

function dueLabel(days: number) {
  if (days < 0)
    return `متأخر ${Math.abs(days)} ${Math.abs(days) === 1 ? "يوم" : "أيام"}`;
  if (days === 0) return "اليوم";
  if (days === 1) return "غداً";
  return `بعد ${days} أيام`;
}

export async function DeadlinesPanel() {
  const [{ items, today }, stats] = await Promise.all([
    upcomingDeadlines(),
    dashboardStats(),
  ]);
  const more = stats.pendingDeadlines - items.length;

  return (
    <section className="animate-fade-in flex-col-start gap-2 rounded-sm border bg-background p-4">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <AlarmClock className="size-5 text-primary" aria-hidden />
        المواعيد النهائية
      </h2>

      {items.length === 0 ? (
        <div className="flex-col-center gap-3 w-full grow text-muted-foreground">
          <FilePen className="size-8" />
          <p className="text-center text-sm ">لا يوجد مواعيد نهائية معلّقة.</p>
        </div>
      ) : (
        <ul className="divide-y w-full">
          {items.map((d) => {
            const days = daysBetween(today, d.dueDate);
            const overdue = days < 0;

            return (
              <li key={d.id}>
                <Link
                  href={`${CASES_BASE}/${d.caseId}`}
                  className="flex-between flex-wrap gap-x-4 gap-y-1 py-3 hover:text-primary w-full"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      <span>{d.caseNumber}</span> · {d.clientName}
                    </p>
                  </div>
                  <div className="text-end">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        overdue && "text-red-700",
                      )}
                    >
                      {dueLabel(days)}
                    </p>
                    <p className="text-xs text-muted-foreground">{d.dueDate}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {more > 0 && (
        <p className="text-xs text-muted-foreground">و {more} أخرى</p>
      )}
    </section>
  );
}
