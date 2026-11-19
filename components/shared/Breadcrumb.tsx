import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Crumb = { label: string; href?: string };

// The last crumb is the current page: plain text, not a link
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="مسار التنقل">
      <ol className="flex-start flex-wrap gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex-start gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "font-medium text-foreground" : undefined}
                >
                  {item.label}
                </span>
              )}
              {/* In RTL the "next" direction points left */}
              {!last && <ChevronLeft className="size-3.5" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}