"use client";

import { useState, useTransition } from "react";
import { Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteHearing } from "../actions";
import type { HearingFormValues } from "../schemas";
import { HearingFormDialog } from "./HearingFormDialog";
import { HearingOutcomeDialog } from "./HearingOutcomeDialog";

type DialogName = "edit" | "outcome" | "delete" | null;

type Props = {
  id: string;
  caseId: string;
  status: string;
  label: string; // formatted date and time, used in the delete message
  initialValues: HearingFormValues;
};

export function HearingRowActions({
  id,
  caseId,
  status,
  label,
  initialValues,
}: Props) {
  const [dialog, setDialog] = useState<DialogName>(null);
  const [pending, startTransition] = useTransition();
  const scheduled = status === "scheduled";

  const close = () => setDialog(null);

  const runDelete = () =>
    startTransition(async () => {
      const result = await deleteHearing(id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("تم حذف الجلسة");
      close();
    });

  return (
    <div className="flex items-center gap-1">
      {scheduled && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-sm!"
          onClick={() => setDialog("outcome")}
        >
          تسجيل القرار
        </Button>
      )}

      {/* modal={false}: otherwise the page can stay unclickable after a dialog opens from the menu */}
      <DropdownMenu modal={false} dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={pending}
            aria-label="إجراءات الجلسة"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MoreVertical className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {scheduled && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => setDialog("edit")}
              >
                <Pencil className="size-4" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={() => setDialog("delete")}
          >
            <Trash2 className="size-4" />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* All dialogs live outside the menu on purpose: they stay mounted when the menu closes */}
      <HearingFormDialog
        open={dialog === "edit"}
        onOpenChange={(open) => !open && close()}
        caseId={caseId}
        hearingId={id}
        initialValues={initialValues}
      />
      <HearingOutcomeDialog
        open={dialog === "outcome"}
        onOpenChange={(open) => !open && close()}
        hearingId={id}
      />

      <AlertDialog
        open={dialog === "delete"}
        onOpenChange={(next) => !pending && !next && close()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الجلسة؟</AlertDialogTitle>
            <AlertDialogDescription>
              هتتحذف جلسة «{label}» نهائياً ولا يمكن التراجع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              className={buttonVariants({ variant: "destructive" })}
              onClick={(e) => {
                e.preventDefault(); // keep it open until the server replies
                runDelete();
              }}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              حذف نهائي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
