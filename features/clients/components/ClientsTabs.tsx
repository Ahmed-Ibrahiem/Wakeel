import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "النشطين", href: "/dashboard/clients", archived: false },
  { label: "المؤرشفين", href: "/dashboard/clients?archived=1", archived: true },
];

export function ClientsTabs({ archived }: { archived: boolean }) {
  return (
    <nav aria-label="تصفية العملاء" className="inline-flex rounded-sm bg-muted p-1">
      {tabs.map((tab) => {
        const active = tab.archived === archived;
        return (
          <Link
            key={tab.href}
            href={tab.href}
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
  );
}