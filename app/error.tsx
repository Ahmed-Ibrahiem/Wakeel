"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Details stay in the console / server logs, never on screen
    console.error(error);
  }, [error]);

  return (
    <main className="flex-col-center min-h-screen p-4">
      <div className="w-full max-w-lg">
        <EmptyState
          icon={TriangleAlert}
          title="حدث خطأ غير متوقع"
          description="تعذّر تحميل هذه الصفحة. حاول مرة أخرى، وإذا استمرت المشكلة فأعد المحاولة بعد قليل."
        >
          <div className="flex-center flex-wrap gap-3">
            <Button className="rounded-sm!" onClick={reset}>
              إعادة المحاولة
            </Button>
            <Link
              href="/"
              className={buttonVariants({
                variant: "secondary",
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