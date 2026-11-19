import { FolderOpen, Gavel, Scale, type LucideIcon } from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-sm border bg-background p-4">
      <div className="flex-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="size-6 text-primary" aria-hidden />
      </div>
      <p className="text-3xl font-bold text-text-heading tabular-nums">
        {children}
      </p>
    </div>
  );
}

export function ClientStats({
  total,
  ongoing,
  latestCaseNumber,
}: {
  total: number;
  ongoing: number;
  latestCaseNumber: string | null;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard icon={FolderOpen} label="إجمالي القضايا">
        {total}
      </StatCard>
      <StatCard icon={Scale} label="القضايا الجارية">
        {ongoing}
      </StatCard>
      <StatCard icon={Gavel} label="آخر قضية">
        {latestCaseNumber ? <span dir="ltr">{latestCaseNumber}</span> : "—"}
      </StatCard>
    </div>
  );
}