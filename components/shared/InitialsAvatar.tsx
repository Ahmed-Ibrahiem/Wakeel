import { cn } from "@/lib/utils";

export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
  const text = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => Array.from(w)[0])
    .join(" ");

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground",
        className,
      )}
    >
      {text}
    </span>
  );
}