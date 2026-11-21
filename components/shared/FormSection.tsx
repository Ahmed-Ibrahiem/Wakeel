import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormSection({
  title,
  icon: Icon,
  action,
  className,
  children,
}: {
  title: string;
  icon: LucideIcon;
  action?: React.ReactNode; // e.g. a "view all" link on the opposite side
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn("rounded-sm border bg-background p-3.5 shadow-sm animate-fade-in w-full", className)}
    >
      <div className="flex-between mb-4 gap-2">
        <h2 className="flex-start gap-2 text-base font-bold">
          <Icon className="size-5 text-primary" aria-hidden />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}