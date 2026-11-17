import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { DetailItem as Item } from "@/components/shared/DetailItem";
import { formatPhone } from "@/lib/phone";
import { getClient } from "@/features/clients/queries";
import { ClientCasesSection } from "@/features/clients/components/ClientCasesSection";

type Params = Promise<{ id: string }>;

export default async function ClientDetailsPage({ params }: { params: Params }) {
  const { id } = await params;

  const client = await getClient(id);
  if (!client) notFound(); // missing and "not yours" look exactly the same

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/dashboard/clients"
        className="inline-flex flex-start gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" />
        كل العملاء
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-start gap-3">
          <InitialsAvatar name={client.fullName} />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{client.fullName}</h1>
            {client.archivedAt && (
              <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700">
                مؤرشف
              </span>
            )}
          </div>
        </div>

        <Button asChild className="rounded-sm!">
          <Link href={`/dashboard/clients/${client.id}/edit`}>
            <Pencil className="size-4" />
            تعديل
          </Link>
        </Button>
      </header>

      <section className="grid gap-6 rounded-sm border bg-background p-6 sm:grid-cols-2">
        <Item label="رقم الهاتف">
          {client.phone ? <span dir="ltr">{formatPhone(client.phone)}</span> : "—"}
        </Item>
        <Item label="البريد الإلكتروني">
          {client.email ? <span dir="ltr">{client.email}</span> : "—"}
        </Item>
        <Item label="العنوان">{client.address ?? "—"}</Item>
        <Item label="تاريخ أول تعامل">
          <span dir="ltr">{client.firstContactDate}</span>
        </Item>
      </section>

      <Suspense
        fallback={
          <div className="h-32 animate-pulse rounded-sm border bg-muted/40" />
        }
      >
        <ClientCasesSection clientId={client.id} />
      </Suspense>
    </div>
  );
}