import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <header className="flex-start gap-3">
      <span className="flex-center size-13 shrink-0 rounded-lg bg-secondary text-primary">
        <Icon className="size-7" aria-hidden />
      </span>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </header>
  );
}