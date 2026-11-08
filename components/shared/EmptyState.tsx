import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, children }: Props) {
  return (
    <div className="flex flex-col-center gap-3 rounded-xl border border-dashed bg-background px-6 py-14 text-center h-full">
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Icon className="size-6" aria-hidden />
      </span>
      <h2 className="text-lg font-bold">{title}</h2>
      {description && (
        <p className="max-w-sm break-words text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}