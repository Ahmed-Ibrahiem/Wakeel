import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Icon + small label + value. The divider line shows on large screens only.
export function InfoCell({
  icon: Icon,
  label,
  className,
  children,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex-start gap-3 xl:border-s xl:ps-5", className)}>
      <Icon className="size-5 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-text-heading wrap-break-word">
          {children}
        </p>
      </div>
    </div>
  );
}