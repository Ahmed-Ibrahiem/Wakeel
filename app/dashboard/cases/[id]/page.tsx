import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCase } from "@/features/cases/queries";
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_STYLES,
  CASE_TYPE_LABELS,
} from "@/features/cases/labels";
import { Suspense } from "react";
import { HearingsSection } from "@/features/hearings/components/HearingsSection";
import { DeadlinesSection } from "@/features/deadlines/components/DeadlinesSection";
import { DetailItem as Item } from "@/components/shared/DetailItem";

type Params = Promise<{ id: string }>;

export default async function CaseDetailsPage({ params }: { params: Params }) {
  const { id } = await params;

  const item = await getCase(id);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/cases"
        className="inline-flex flex-start gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" />
        كل القضايا
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold" dir="ltr">
            {item.caseNumber}
          </h1>
          <div className="flex-start flex-wrap  gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                CASE_STATUS_STYLES[item.status],
              )}
            >
              {CASE_STATUS_LABELS[item.status] ?? item.status}
            </span>
            {item.archivedAt && (
              <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700">
                مؤرشفة
              </span>
            )}
          </div>
        </div>

        <Button asChild className="rounded-sm!">
          <Link href={`/dashboard/cases/${item.id}/edit`}>
            <Pencil className="size-4" />
            تعديل
          </Link>
        </Button>
      </header>

      <section className="grid gap-6 rounded-sm border bg-background p-6 sm:grid-cols-2">
        <Item label="الموكل">
          <Link
            href={`/dashboard/clients/${item.clientId}`}
            className="hover:text-primary hover:underline"
          >
            {item.clientName}
          </Link>
        </Item>
        <Item label="نوع القضية">
          {CASE_TYPE_LABELS[item.caseType] ?? item.caseType}
        </Item>
        <Item label="المحكمة">{item.courtName}</Item>
        <Item label="الخصم">{item.opposingParty ?? "—"}</Item>
        <Item label="تاريخ الحكم">
          {item.judgmentDate ? <span dir="ltr">{item.judgmentDate}</span> : "—"}
        </Item>
        {item.notes && (
          <div className="sm:col-span-2">
            <Item label="ملاحظات">
              {/* React escapes text; whitespace-pre-wrap keeps the line breaks */}
              <p className="whitespace-pre-wrap">{item.notes}</p>
            </Item>
          </div>
        )}
      </section>

      <Suspense
        fallback={
          <div className="h-32 animate-pulse rounded-sm border bg-muted/40" />
        }
      >
        <HearingsSection caseId={item.id} />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-32 animate-pulse rounded-xl border bg-muted/40" />
        }
      >
        <DeadlinesSection caseId={item.id} />
      </Suspense>
    </div>
  );
}
