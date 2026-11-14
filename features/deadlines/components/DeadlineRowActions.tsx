"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, MoreVertical, Pencil, RotateCcw, Trash2 } from "lucide-react";
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
import { deleteDeadline, markDeadlineDone, reopenDeadline } from "../actions";
import type { DeadlineFormValues } from "../schemas";
import { DeadlineFormDialog } from "./DeadlineFormDialog";

type DialogName = "edit" | "delete" | null;

type Props = {
  id: string;
  caseId: string;
  status: string;
  title: string;
  initialValues: DeadlineFormValues;
};

export function DeadlineRowActions({
  id,
  caseId,
  status,
  title,
  initialValues,
}: Props) {
  const [dialog, setDialog] = useState<DialogName>(null);
  const [pending, startTransition] = useTransition();
  const isPending = status === "pending";

  const close = () => setDialog(null);

  // Marking done / reopening is harmless, so there is no confirmation dialog
  const toggle = () =>
    startTransition(async () => {
      const result = isPending
        ? await markDeadlineDone(id)
        : await reopenDeadline(id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(isPending ? "تم إنهاء الموعد" : "أُعيد الموعد إلى حالة التعليق");
    });

  const runDelete = () =>
    startTransition(async () => {
      const result = await deleteDeadline(id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("تم حذف الموعد");
      close();
    });

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-sm!"
        disabled={pending}
        onClick={toggle}
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isPending ? (
          <Check className="size-4" />
        ) : (
          <RotateCcw className="size-4" />
        )}
        {isPending ? "تم" : "إرجاع"}
      </Button>

      {/* modal={false}: otherwise the page can stay unclickable after a dialog opens from the menu */}
      <DropdownMenu modal={false} dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={pending}
            aria-label="إجراءات الموعد"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {isPending && (
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

      {/* Dialogs live outside the menu on purpose: they stay mounted when the menu closes */}
      <DeadlineFormDialog
        open={dialog === "edit"}
        onOpenChange={(open) => !open && close()}
        caseId={caseId}
        deadlineId={id}
        initialValues={initialValues}
      />

      <AlertDialog
        open={dialog === "delete"}
        onOpenChange={(next) => !pending && !next && close()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الموعد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هيتحذف موعد «{title}» نهائياً ولا يمكن التراجع.
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