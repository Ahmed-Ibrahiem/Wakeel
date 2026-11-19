import { Pulse } from "@/components/shared/Pulse";

// Mirrors the layout of CaseForm: client card, details card, two side cards, buttons.
// Heights are approximate (one row of fields per card).
export function CaseFormSkeleton() {
  return (
    <div className="space-y-5">
      <Pulse className="h-32" /> {/* client + preview */}
      <Pulse className="h-32" /> {/* case details */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Pulse className="h-40" /> {/* status + dates */}
        <Pulse className="h-40" /> {/* notes */}
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Pulse className="h-9 w-32" /> {/* submit */}
        <Pulse className="h-9 w-24" /> {/* cancel */}
      </div>
    </div>
  );
}
