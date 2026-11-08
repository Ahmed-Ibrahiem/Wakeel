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

export function ClientsTable({ clients }: { clients: Client[] }) {
  return (
    <div className="h-117 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent hover:bg-accent! border-1 border-border rounded-sm!">
            <TableHead>الاسم</TableHead>
            <TableHead>رقم الهاتف</TableHead>
            <TableHead className="hidden md:table-cell">
              تاريخ أول تعامل
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={c.fullName} />
                  <span className="font-medium">{c.fullName}</span>
                </div>
              </TableCell>
              <TableCell dir="ltr" className="text-right tabular-nums">
                {formatPhone(c.phone)}
              </TableCell>
              <TableCell
                dir="ltr"
                className="hidden text-right tabular-nums md:table-cell"
              >
                {c.firstContactDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
