"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Info, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CASE_STATUS_LABELS } from "@/features/cases/labels";

// Plain strings only: these rows cross the server -> client boundary
export type ClientCaseRow = {
  id: string;
  caseNumber: string;
  typeLabel: string;
  courtName: string;
  status: string;
  statusLabel: string;
  statusStyle: string;
  archived: boolean;
  urgent: boolean;
  updatedLabel: string;
};

type StatusFilter = "all" | "ongoing" | "postponed" | "closed";

const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "ongoing", label: CASE_STATUS_LABELS.ongoing },
  { id: "postponed", label: CASE_STATUS_LABELS.postponed },
  { id: "closed", label: CASE_STATUS_LABELS.closed },
];

export function ClientCasesTable({ rows }: { rows: ClientCaseRow[] }) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [q, setQ] = useState("");

  // A client has at most 100 cases and all of them are already here,
  // so filtering in memory is instant and costs no server round trip
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (status === "all" || r.status === status) &&
        (needle === "" || r.caseNumber.toLowerCase().includes(needle)),
    );
  }, [rows, status, q]);

  return (
    <section className="space-y-4 rounded-sm border bg-background p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">قضايا العميل</h2>
          <p className="text-xs text-muted-foreground">
            جميع القضايا المرتبطة بهذا العميل
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={status === f.id}
                onClick={() => setStatus(f.id)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  status === f.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-accent",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث برقم القضية..."
              aria-label="ابحث برقم القضية"
              maxLength={50}
              autoComplete="off"
              className="p-2.5 ps-9"
            />
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          لا توجد قضايا تطابق البحث.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-accent hover:bg-accent">
              <TableHead>رقم القضية</TableHead>
              <TableHead>نوع القضية</TableHead>
              <TableHead>المحكمة</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>تاريخ آخر تحديث</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex-start gap-2">
                    <span className="font-medium tabular-nums" dir="ltr">
                      {r.caseNumber}
                    </span>
                    {r.urgent && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                        عاجلة
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{r.typeLabel}</TableCell>
                <TableCell>{r.courtName}</TableCell>
                <TableCell>
                  <div className="flex-start flex-wrap gap-1.5">
                    <span
                      className={cn(
                        "flex-start gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                        r.statusStyle,
                      )}
                    >
                      <span
                        className="size-1.5 rounded-full bg-current"
                        aria-hidden
                      />
                      {r.statusLabel}
                    </span>
                    {r.archived && (
                      <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-700">
                        مؤرشفة
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{r.updatedLabel}</TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/cases/${r.id}`}
                    className="flex-start gap-1 text-sm font-medium"
                  >
                    عرض القضية
                    <ArrowLeft className="size-4" aria-hidden />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <p className="flex-start gap-2 rounded-sm bg-secondary p-3 text-sm text-black">
        <Info className="size-4 shrink-0 text-primary" aria-hidden />
        يمكنك فتح أي قضية للاطلاع على تفاصيلها وجلساتها ومواعيدها وملاحظاتها.
      </p>
    </section>
  );
}
