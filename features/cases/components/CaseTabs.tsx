import Link from "next/link";
import {
  CalendarDays,
  Clock,
  FileText,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CASE_TAB_IDS, CASE_TAB_LABELS, type CaseTab } from "../tabs";

const TAB_ICONS: Record<CaseTab, LucideIcon> = {
  overview: FileText,
  hearings: CalendarDays,
  deadlines: Clock,
  notes: StickyNote,
};

export function CaseTabs({
  caseId,
  active,
}: {
  caseId: string;
  active: CaseTab;
}) {
  return (
    // overflow-x-auto: on a phone the tabs scroll sideways instead of wrapping
    <nav
      aria-label="أقسام القضية"
      className="animate-fade-in overflow-x-auto rounded-sm border bg-background p-1.5"
    >
      <ul className="flex min-w-max gap-1">
        {CASE_TAB_IDS.map((id) => {
          const Icon = TAB_ICONS[id];
          const isActive = id === active;
          return (
            <li key={id} className="flex-1">
              <Link
                href={
                  id === "overview"
                    ? `/dashboard/cases/${caseId}`
                    : `/dashboard/cases/${caseId}?tab=${id}`
                }
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex-center gap-2 whitespace-nowrap rounded-sm px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {CASE_TAB_LABELS[id]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}