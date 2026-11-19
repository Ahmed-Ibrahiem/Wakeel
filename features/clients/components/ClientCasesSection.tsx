import { Briefcase } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatLongDate } from "@/lib/format-date";
import { getCaseSignals } from "@/features/cases/signals";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_STYLES,
  CASE_TYPE_LABELS,
} from "@/features/cases/labels";
import { ClientCasesTable, type ClientCaseRow } from "./ClientCasesTable";

type CaseItem = Parameters<typeof getCaseSignals>[0] & {
  id: string;
  caseNumber: string;
  caseType: string;
  courtName: string;
  status: string;
  archivedAt: Date | null;
  updatedAt: Date;
};

export function ClientCasesSection({
  cases,
  timeZone,
}: {
  cases: CaseItem[];
  timeZone: string;
}) {
  if (cases.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="لا توجد قضايا لهذا العميل"
        description="عند إضافة قضية لهذا العميل ستظهر هنا."
      />
    );
  }

  const rows: ClientCaseRow[] = cases.map((c) => ({
    id: c.id,
    caseNumber: c.caseNumber,
    typeLabel: CASE_TYPE_LABELS[c.caseType] ?? c.caseType,
    courtName: c.courtName,
    status: c.status,
    statusLabel: CASE_STATUS_LABELS[c.status] ?? c.status,
    statusStyle: CASE_STATUS_STYLES[c.status] ?? "",
    archived: Boolean(c.archivedAt),
    urgent: getCaseSignals(c, timeZone).urgent,
    updatedLabel: formatLongDate(c.updatedAt, timeZone),
  }));

  return <ClientCasesTable rows={rows} />;
}
