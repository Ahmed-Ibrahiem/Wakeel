import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
};

function getPageItems(page: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | "gap")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);

  if (start > 2) items.push("gap");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("gap");
  items.push(total);

  return items;
}

export function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;

  const arrow = buttonVariants({
    variant: "outline",
    size: "icon",
    className: "w-9! h-9! border-border! ",
  });

  return (
    <nav aria-label="التنقل بين الصفحات" className="flex items-center gap-1 ">
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          aria-label="الصفحة السابقة"
          className={arrow}
        >
          <ChevronRight className="size-5" />
        </Link>
      ) : (
        <span
          aria-hidden
          className={cn(arrow, "pointer-events-none opacity-50 bg-gray-300! text-gray-500!")}
        >
          <ChevronRight className="size-5" />
        </span>
      )}

      {getPageItems(page, totalPages).map((item, i) =>
        item === "gap" ? (
          <span
            key={`gap-${i}`}
            aria-hidden
            className="px-1 text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-label={`الصفحة ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={buttonVariants({
              variant: item === page ? "default" : "secondary",
              size: "icon",
              className: "w-9! h-9! border! border-border!",
            })}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          aria-label="الصفحة التالية"
          className={arrow}
        >
          <ChevronLeft className="size-5" />
        </Link>
      ) : (
        <span
          aria-hidden
          className={cn(arrow, "pointer-events-none opacity-50")}
        >
          <ChevronLeft className="size-5" />
        </span>
      )}
    </nav>
  );
}
