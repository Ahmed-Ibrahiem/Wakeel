import { Pulse } from "@/components/shared/Pulse";

// Mirrors the layout of ClientForm. Heights are computed from its paddings and rows:
// card = 48 (p-6) + 36 (title) + 64 per row of fields (+ 20 gap between rows)
export function ClientFormSkeleton() {
  return (
    <div className="space-y-5">
      <Pulse className="h-37" /> {/* name + first contact date: 1 row */}
      <Pulse className="h-58" /> {/* email + phone, address: 2 rows */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Pulse className="h-10 w-28" /> {/* submit */}
        <Pulse className="h-10 w-24" /> {/* cancel */}
      </div>
    </div>
  );
}