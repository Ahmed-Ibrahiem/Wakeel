import { Mail, Phone } from "lucide-react";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { formatPhone } from "@/lib/phone";

type PreviewClient = {
  fullName: string;
  phone: string | null;
  email: string | null;
};

export function ClientPreview({ client }: { client?: PreviewClient }) {
  if (!client) {
    return (
      <div className="flex-center rounded-sm border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
        اختر الموكل لعرض بياناته
      </div>
    );
  }

  return (
    <div className="flex-start gap-5 rounded-sm border bg-accent/50 p-4">
      <InitialsAvatar className="w-15 h-15 text-[16px]" name={client.fullName} />
      <div className="min-w-0 space-y-1">
        <p className="font-bold text-text-heading wrap-break-word">
          {client.fullName}
        </p>
        {client.phone && (
          <p className="flex-start gap-2 text-sm">
            <Phone className="size-3.5 text-primary" aria-hidden />
            <span dir="ltr">{formatPhone(client.phone)}</span>
          </p>
        )}
        {client.email && (
          <p className="flex-start gap-2 text-sm">
            <Mail className="size-3.5 text-primary" aria-hidden />
            <span dir="ltr" className="break-all">
              {client.email}
            </span>
          </p>
        )}
        {!client.phone && !client.email && (
          <p className="text-sm text-muted-foreground">
            لا توجد بيانات تواصل لهذا الموكل
          </p>
        )}
      </div>
    </div>
  );
}