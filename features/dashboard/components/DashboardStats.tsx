import Link from "next/link";
import {
  AlarmClock,
  CalendarDays,
  CalendarRange,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { casesHref } from "@/features/cases/url";
import { dashboardStats } from "../queries";

type Tone = "green" | "blue" | "purple" | "red";

const TONES: Record<Tone, string> = {
  green: "bg-emerald-100 text-emerald-700",
  blue: "bg-sky-100 text-sky-700",
  purple: "bg-violet-100 text-violet-700",
  red: "bg-red-100 text-red-700",
};

function StatCard({
  icon: Icon,
  tone,
  label,
  value,
  note,
  noteTone,
  href,
}: {
  icon: LucideIcon;
  tone: Tone;
  label: string;
  value: number;
  note: string;
  noteTone?: "warning" | "danger";
  href?: string;
}) {
  const noteClass = cn(
    "text-xs text-muted-foreground",
    noteTone === "warning" && "text-amber-700",
    noteTone === "danger" && "text-red-700",
  );

  return (
    <div className="flex-start gap-4 rounded-sm border bg-background p-4">
      <div className={cn("rounded-full p-3", TONES[tone])}>
        <Icon className="size-6" aria-hidden />
      </div>
      <div className="min-w-0 flex-col-start gap-1.5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold tabular-nums">{value}</p>
        {href ? (
          <Link href={href} className={cn(noteClass, "hover:text-primary")}>
            {note}
          </Link>
        ) : (
          <p className={noteClass}>{note}</p>
        )}
      </div>
    </div>
  );
}

export async function DashboardStats() {
  const s = await dashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={FolderOpen}
        tone="green"
        label="القضايا الجارية"
        value={s.ongoingCases}
        note="عرض القضايا"
        href={casesHref({ status: "ongoing" })}
      />
      <StatCard
        icon={CalendarDays}
        tone="blue"
        label="جلسات اليوم"
        value={s.hearingsToday}
        note={
          s.undecidedHearings > 0
            ? `${s.undecidedHearings} جلسة بدون قرار`
            : "لا توجد جلسات متأخرة"
        }
        noteTone={s.undecidedHearings > 0 ? "warning" : undefined}
      />
      <StatCard
        icon={CalendarRange}
        tone="purple"
        label="جلسات الـ 7 أيام القادمة"
        value={s.hearingsWeek}
        note="من اليوم"
      />
      <StatCard
        icon={AlarmClock}
        tone="red"
        label="مواعيد نهائية معلّقة"
        value={s.pendingDeadlines}
        note={
          s.overdueDeadlines > 0
            ? `${s.overdueDeadlines} متأخر`
            : "لا يوجد متأخر"
        }
        noteTone={s.overdueDeadlines > 0 ? "danger" : undefined}
      />
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-sm border bg-muted/40"
        />
      ))}
    </div>
  );
}