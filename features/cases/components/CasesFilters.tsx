import Link from "next/link";
import { cn } from "@/lib/utils";
import { casesHref } from "../url";
import { CASE_STATUS_LABELS } from "../labels";

type Props = { q: string; status: string; archived: boolean };

export function CasesFilters({ q, status, archived }: Props) {
  const tabs = [
    { label: "النشطة", archived: false },
    { label: "المؤرشفة", archived: true },
  ];
  const chips = [
    { value: "all", label: "الكل" },
    ...Object.entries(CASE_STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const active = c.value === status;
          return (
            <Link
              key={c.value}
              href={casesHref({ q, status: c.value, archived })}
              aria-current={active ? "true" : undefined}
              className={cn(
                "rounded-sm border px-4 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      <nav aria-label="تصفية القضايا" className="inline-flex rounded-sm bg-muted p-1">
        {tabs.map((tab) => {
          const active = tab.archived === archived;
          return (
            <Link
              key={tab.label}
              href={casesHref({ q, status, archived: tab.archived })}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-sm px-4 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}