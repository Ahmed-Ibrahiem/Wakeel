"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Only the digest reaches the browser in production: the full error stays in the server logs
    console.error("dashboard error", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md h-full flex-col-center gap-3 py-16 text-center">
      <AlertTriangle className="size-10 text-amber-600" aria-hidden />
      <h2 className="text-lg font-bold">حصلت مشكلة أثناء تحميل الصفحة</h2>
      <p className="text-sm text-muted-foreground">
        بياناتك بأمان. حاول مرة اخري، واذا استمرت المشكلة حاول مرة اخري لاحقا.
      </p>
      <Button onClick={reset} className="rounded-sm!">
        حاول مرة اخري
      </Button>
    </div>
  );
}
