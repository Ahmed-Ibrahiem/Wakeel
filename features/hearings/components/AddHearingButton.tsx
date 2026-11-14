"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HearingFormDialog } from "./HearingFormDialog";

export function AddHearingButton({ caseId }: { caseId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="sm"
        className="rounded-sm!"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        إضافة جلسة
      </Button>
      <HearingFormDialog open={open} onOpenChange={setOpen} caseId={caseId} />
    </>
  );
}