"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BiLoaderAlt } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { startDemo } from "../actions";

export default function DemoButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const result = await startDemo();
      if (!result.success) {
        toast.error(result.message);
        setLoading(false);
        return;
      }
      // Keep the loading state until the navigation finishes
      router.replace("/dashboard");
      router.refresh();
    } catch {
      toast.error("تعذّر فتح النسخة التجريبية، حاول مرة أخرى");
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="default"
      className={`flex-center gap-2 ${className ?? ""}`}
      disabled={loading}
      onClick={handleClick}
    >
      {loading && <BiLoaderAlt className="animate-spin" />}
      جرّب النسخة التجريبية
    </Button>
  );
}
