import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import { InfoCell } from "@/components/shared/InfoCell";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { formatLongDateString } from "@/lib/format-date";
import { formatPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

type Props = {
  fullName: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  firstContactDate: string;
  archived: boolean;
  isActive: boolean;
};

export function ClientProfileCard({
  fullName,
  phone,
  email,
  address,
  firstContactDate,
  archived,
  isActive,
}: Props) {
  const status = archived
    ? {
        label: "مؤرشف",
        hint: "هذا العميل في الأرشيف",
        style: "bg-stone-200 text-stone-700",
      }
    : isActive
      ? {
          label: "نشط",
          hint: "لديه قضايا مفتوحة",
          style: "bg-emerald-100 text-emerald-800",
        }
      : {
          label: "غير نشط",
          hint: "لا توجد قضايا مفتوحة",
          style: "bg-stone-200 text-stone-700",
        };

  return (
    <section className="grid gap-4 rounded-sm border bg-background p-5 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.4fr_1.2fr_1fr] lg:items-center">
      <div className="flex-start gap-4">
        <InitialsAvatar name={fullName} className="size-16 text-xl" />
        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-bold wrap-break-word">{fullName}</h2>
          <span
            className={cn(
              "flex-start w-fit gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
              status.style,
            )}
          >
            <span className="size-1.5 rounded-full bg-current" aria-hidden />
            {status.label}
          </span>
          <p className="text-xs text-muted-foreground">{status.hint}</p>
        </div>
      </div>

      <InfoCell icon={Phone} label="رقم الهاتف">
        {phone ? <span dir="ltr">{formatPhone(phone)}</span> : "—"}
      </InfoCell>
      <InfoCell icon={Mail} label="البريد الإلكتروني">
        {email ? (
          <span dir="ltr" className="break-all">
            {email}
          </span>
        ) : (
          "—"
        )}
      </InfoCell>
      <InfoCell icon={MapPin} label="العنوان">
        {address ?? "—"}
      </InfoCell>
      <InfoCell icon={Calendar} label="تاريخ أول تعامل">
        {formatLongDateString(firstContactDate)}
      </InfoCell>
    </section>
  );
}
