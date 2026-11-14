import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <span className="sr-only">جاري التحميل...</span>

      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Skeleton className="h-10 w-full" />

      <div className="space-y-4 rounded-sm border bg-background p-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex-start gap-3">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="ms-auto h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
