import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Clock,
  Gavel,
  Info,
  UserRound,
} from "lucide-react";
import { DetailItem as Item } from "@/components/shared/DetailItem";
import { FormSection } from "@/components/shared/FormSection";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { todayIn } from "@/lib/dates";
import { formatLongDate, formatLongDateString } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { getClient } from "@/features/clients/queries";
import { listCaseHearings } from "@/features/hearings/queries";
import { groupHearings } from "@/features/hearings/group";
import {
  HEARING_STATUS_LABELS,
  HEARING_STATUS_STYLES,
  HEARING_TYPE_LABELS,
} from "@/features/hearings/labels";
import { listCaseDeadlines } from "@/features/deadlines/queries";
import { groupDeadlines } from "@/features/deadlines/group";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_STYLES,
  CASE_TYPE_LABELS,
} from "../labels";
import { buildUpcoming } from "../overview";
import { ClientPreview } from "./ClientPreview";

type CaseItem = {
  id: string;
  clientId: string;
  caseNumber: string;
  caseType: string;
  courtName: string;
  status: string;
  judgmentDate: string | null;
};

function ViewAll({ caseId }: { caseId: string }) {
  return (
    <Link
      href={`/dashboard/cases/${caseId}?tab=hearings`}
      scroll={false}
      className="flex-start gap-1 text-xs font-medium"
    >
      عرض الكل
      <ArrowLeft className="size-3.5" aria-hidden />
    </Link>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export async function CaseOverview({
  item,
  timeZone,
}: {
  item: CaseItem;
  timeZone: string;
}) {
  const [hearingList, deadlineList, client] = await Promise.all([
    listCaseHearings(item.id),
    listCaseDeadlines(item.id),
    getClient(item.clientId),
  ]);

  const { upcoming: upcomingHearings, past } = groupHearings(hearingList);
  const { upcoming: upcomingDeadlines } = groupDeadlines(
    deadlineList,
    todayIn(timeZone),
  );

  const recent = past.slice(0, 3); // already newest first
  const upcoming = buildUpcoming(upcomingHearings, upcomingDeadlines, timeZone);

  return (
    <div >
      {/* Main column: first in the DOM, so it sits on the right in RTL */}
      <div className="grid gap-3 xl:grid-cols-3">
        <FormSection
          className="xl:col-span-2"
          title="معلومات القضية الأساسية"
          icon={Info}
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <Item label="رقم القضية">
              <span dir="ltr">{item.caseNumber}</span>
            </Item>
            <Item label="حالة القضية">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  CASE_STATUS_STYLES[item.status],
                )}
              >
                {CASE_STATUS_LABELS[item.status] ?? item.status}
              </span>
            </Item>
            <Item label="نوع القضية">
              {CASE_TYPE_LABELS[item.caseType] ?? item.caseType}
            </Item>
            <Item label="تاريخ الحكم">
              {item.judgmentDate
                ? formatLongDateString(item.judgmentDate)
                : "—"}
            </Item>
            <Item label="المحكمة">{item.courtName}</Item>
          </div>
        </FormSection>

        <FormSection title="الموكل" icon={UserRound}>
          <div className="space-y-3">
            {client ? (
              <ClientPreview client={client} />
            ) : (
              <Empty>بيانات الموكل غير متاحة.</Empty>
            )}
            <Button asChild variant="outline" className="w-full rounded-sm!">
              <Link href={`/dashboard/clients/${item.clientId}`}>
                <ArrowLeft className="size-4" aria-hidden />
                عرض بيانات العميل
              </Link>
            </Button>
          </div>
        </FormSection>

        <FormSection
          title="آخر الجلسات"
          icon={Gavel}
          action={<ViewAll caseId={item.id} />}
          className="xl:col-span-2"
        >
          {recent.length === 0 ? (
            <Empty>لا توجد جلسات سابقة لهذه القضية.</Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-accent hover:bg-accent">
                  <TableHead>التاريخ</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>النتيجة</TableHead>
                  <TableHead>ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>
                      {formatLongDate(h.hearingAt, timeZone)}
                    </TableCell>
                    <TableCell>{HEARING_TYPE_LABELS[h.type]}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-sm font-medium",
                          HEARING_STATUS_STYLES[h.status],
                        )}
                      >
                        {HEARING_STATUS_LABELS[h.status]}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-56 text-sm text-muted-foreground">
                      <span className="line-clamp-2">
                        {h.outcome ?? h.notes ?? "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </FormSection>

        <FormSection title="ملخص القضية" icon={ClipboardList}>
          <ul className="space-y-3 text-sm">
            <li className="flex-between gap-3">
              <span className="flex-start gap-2 text-muted-foreground">
                <CalendarDays className="size-4 text-primary" aria-hidden />
                عدد الجلسات
              </span>
              <span className="font-bold tabular-nums">
                {hearingList.length}
              </span>
            </li>
            <li className="flex-between gap-3">
              <span className="flex-start gap-2 text-muted-foreground">
                <Clock className="size-4 text-primary" aria-hidden />
                المواعيد القادمة
              </span>
              <span className="font-bold tabular-nums">{upcoming.length}</span>
            </li>
          </ul>
        </FormSection>

        <FormSection
          title="المواعيد القادمة"
          icon={Clock}
          action={<ViewAll caseId={item.id} />}
          className="col-span-2"
        >
          {upcoming.length === 0 ? (
            <Empty>لا توجد مواعيد قادمة لهذه القضية.</Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-accent hover:bg-accent">
                  <TableHead>التاريخ</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الوقت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcoming.slice(0, 5).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.dateLabel}</TableCell>
                    <TableCell>
                      <span>{u.typeLabel}</span>
                      {u.detail && (
                        <span className="block max-w-56 truncate text-sm text-muted-foreground">
                          {u.detail}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{u.timeLabel ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </FormSection>
      </div>
    </div>
  );
}
