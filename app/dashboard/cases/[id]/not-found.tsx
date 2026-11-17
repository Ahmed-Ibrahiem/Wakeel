import Link from "next/link";
import { Briefcase } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

// Shown whenever notFound() is called inside /dashboard/cases/[id]
// (the details page and the edit page). It renders inside the dashboard
// layout, so the sidebar stays visible.
export default function CaseNotFound() {
  return (
    <div className="flex-center w-full h-full">
      <div className="mx-auto w-2xl max-w-3xl pt-10">
        <EmptyState
          icon={Briefcase}
          title="القضية غير موجودة"
          description="ربما حُذفت هذه القضية، أو أن الرابط غير صحيح."
        >
          <Link
            href="/dashboard/cases"
            className={buttonVariants({ variant: "secondary" })}
          >
            العودة إلى القضايا
          </Link>
        </EmptyState>
      </div>
    </div>
  );
}
