"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeadlineFormDialog } from "./DeadlineFormDialog";

export function AddDeadlineButton({ caseId }: { caseId: string }) {
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
        إضافة موعد
      </Button>
      <DeadlineFormDialog open={open} onOpenChange={setOpen} caseId={caseId} />
    </>
  );
}