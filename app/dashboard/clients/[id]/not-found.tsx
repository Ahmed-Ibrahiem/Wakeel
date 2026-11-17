import Link from "next/link";
import { UserX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

// Shown whenever notFound() is called inside /dashboard/clients/[id]
// (the details page and the edit page). It renders inside the dashboard
// layout, so the sidebar stays visible.
export default function ClientNotFound() {
  return (
    <div className="w-full h-full flex-center">
      <div className="m-auto w-2xl max-w-3xl pt-10">
        <EmptyState
          icon={UserX}
          title="العميل غير موجود"
          description="ربما حُذف هذا العميل، أو أن الرابط غير صحيح."
        >
          <Link
            href="/dashboard/clients"
            className={buttonVariants({ variant: "secondary" })}
          >
            العودة إلى العملاء
          </Link>
        </EmptyState>
      </div>
    </div>
  );
}
