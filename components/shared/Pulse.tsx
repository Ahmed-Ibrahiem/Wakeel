import { cn } from "@/lib/utils";

// A pulsing grey box used as a placeholder by the loading.tsx files
export function Pulse({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-sm border bg-muted/40", className)}
    />
  );
}