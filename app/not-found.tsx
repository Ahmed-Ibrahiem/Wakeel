import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata = { title: "الصفحة غير موجودة" };

export default function NotFound() {
  return (
    <main className="flex-col-center min-h-screen p-4">
      <div className="w-full max-w-lg">
        <EmptyState
          icon={FileQuestion}
          title="الصفحة غير موجودة"
          description="ربما حُذفت هذه الصفحة أو أن الرابط غير صحيح."
        >
          <div className="flex-center flex-wrap gap-3">
            <Link
              href="/dashboard"
              className={buttonVariants({ className: "rounded-sm!" })}
            >
              الذهاب إلى لوحة التحكم
            </Link>
            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                className: "rounded-sm!",
              })}
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </EmptyState>
      </div>
    </main>
  );
}
