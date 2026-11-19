import { Pulse } from "@/components/shared/Pulse";

// Same layout as CaseOverview, used by loading.tsx and by the Suspense fallback in the page,
// so the user sees one skeleton instead of two different ones
export function CaseOverviewSkeleton() {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <Pulse className="h-32" />
        <Pulse className="h-40" />
        <Pulse className="h-40" />
      </div>
      <div className="space-y-3">
        <Pulse className="h-40" />
        <Pulse className="h-24" />
      </div>
    </div>
  );
}