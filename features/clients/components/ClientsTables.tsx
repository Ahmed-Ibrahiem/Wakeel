import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { formatPhone } from "@/lib/phone";
import type { Client } from "@/db/schema";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientRowActions } from "@/features/clients/components/ClientRowActions";

type ClientRow = Client & {
  casesCount: number;
  latestCaseNumber: string | null;
  isActive: boolean;
};

export function ClientsTable({
  clients,
  archived,
}: {
  clients: ClientRow[];
  archived: boolean;
}) {
  return (
    <div className="h-117 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent hover:bg-accent! border-1 border-border rounded-sm! text-center!">
            <TableHead>الاسم</TableHead>
            <TableHead>رقم الهاتف</TableHead>
            <TableHead>القضايا</TableHead>
            <TableHead className="hidden lg:table-cell">آخر قضية</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="hidden md:table-cell">
              تاريخ أول تعامل
            </TableHead>
            <TableHead className="">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={c.fullName} />
                  <Link
                    href={`/dashboard/clients/${c.id}`}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {c.fullName}
                  </Link>
                </div>
              </TableCell>
              <TableCell dir="ltr" className="text-right tabular-nums">
                {formatPhone(c.phone)}
              </TableCell>
              <TableCell className="tabular-nums">
                {c.casesCount > 0 ? c.casesCount : "—"}
              </TableCell>
              <TableCell
                dir="ltr"
                className="hidden text-right tabular-nums lg:table-cell"
              >
                {c.latestCaseNumber ?? "—"}
              </TableCell>
              <TableCell>
                {archived ? (
                  "—"
                ) : (
                  <span
                    className={
                      c.isActive
                        ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-primary"
                        : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500"
                    }
                  >
                    {c.isActive ? "نشط" : "غير نشط"}
                  </span>
                )}
              </TableCell>
              <TableCell
                dir="ltr"
                className="hidden text-right tabular-nums md:table-cell"
              >
                {c.firstContactDate}
              </TableCell>
              <TableCell>
                <div className="flex-start gap-1">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-sm! border!"
                  >
                    <Link
                      href={`/dashboard/clients/${c.id}/edit`}
                      aria-label={`تعديل ${c.fullName}`}
                    >
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <ClientRowActions
                    archived={archived}
                    id={c.id}
                    name={c.fullName}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
