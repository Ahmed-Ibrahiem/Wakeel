import { notFound } from "next/navigation";
import { ClientForm } from "@/features/clients/components/ClientForm";
import { getClient } from "@/features/clients/queries";
import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";
import { splitPhone } from "@/lib/phone";
import { todayIn } from "@/lib/dates";
import { PageHeader } from "@/components/shared/PageHeader";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { UserPen } from "lucide-react";

type Params = Promise<{ id: string }>;

export default async function EditClientPage({ params }: { params: Params }) {
  const { id } = await params;

  // getClient returns null if the client does not exist or is not yours: same result in both cases
  const client = await getClient(id);
  if (!client) notFound();

  const { user } = await requireSession();
  const settings = await getUserSettings(user.id);
  const timezone = settings?.timeZone ?? "UTC";
  const { dialCode, phoneLocal } = splitPhone(client.phone);

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/dashboard" },
            { label: "العملاء", href: "/dashboard/clients" },
            { label: "تعديل بيانات العميل" },
          ]}
        />
        <PageHeader
          icon={UserPen}
          title="تعديل بيانات العميل"
        />
      </div>

      <ClientForm
        today={todayIn(timezone)}
        clientId={client.id}
        initialValues={{
          fullName: client.fullName,
          dialCode,
          phoneLocal,
          email: client.email ?? "",
          address: client.address ?? "",
          firstContactDate: client.firstContactDate,
        }}
      />
    </div>
  );
}
