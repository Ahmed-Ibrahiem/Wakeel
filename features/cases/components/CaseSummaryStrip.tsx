import { Calendar, Gavel, Landmark, Scale, UserRound } from "lucide-react";
import { formatLongDate } from "@/lib/format-date";
import { CASE_TYPE_LABELS } from "../labels";
import { InfoCell } from "@/components/shared/InfoCell";

type Props = {
  caseNumber: string;
  caseType: string;
  courtName: string;
  opposingParty: string | null;
  createdAt: Date;
  timeZone: string;
};

export function CaseSummaryStrip({
  caseNumber,
  caseType,
  courtName,
  opposingParty,
  createdAt,
  timeZone,
}: Props) {
  return (
    <section className="animate-fade-in grid gap-4 rounded-sm border bg-background p-3 sm:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1.4fr_1.4fr_1.1fr] lg:items-center">
      <div className="flex-start gap-3">
        <span className="flex-center size-14 shrink-0 rounded-xl bg-secondary text-primary">
          <Gavel className="size-7" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">رقم القضية</p>
          <p className="text-xl font-bold tabular-nums">{caseNumber}</p>
        </div>
      </div>

      <InfoCell icon={Scale} label="نوع القضية">
        {CASE_TYPE_LABELS[caseType] ?? caseType}
      </InfoCell>
      <InfoCell icon={Landmark} label="المحكمة">
        {courtName}
      </InfoCell>
      <InfoCell icon={UserRound} label="الخصم">
        {opposingParty ?? "—"}
      </InfoCell>
      <InfoCell icon={Calendar} label="تاريخ الإنشاء">
        {formatLongDate(createdAt, timeZone)}
      </InfoCell>
    </section>
  );
}
