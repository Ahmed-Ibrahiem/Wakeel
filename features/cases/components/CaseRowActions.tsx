"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
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
import { archiveCase, deleteCase, restoreCase } from "../actions";

type Dialog = "archive" | "delete" | null;

export function CaseRowActions({
  id,
  number,
  archived,
}: {
  id: string;
  number: string;
  archived: boolean;
}) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const [pending, startTransition] = useTransition();

  const confirm = {
    archive: {
      title: "أرشفة القضية؟",
      description: `ستختفي القضية «${number}» من القائمة، وتبقى بياناتها محفوظة، وتقدر ترجّعها من تبويب المؤرشفة.`,
      label: "أرشفة",
      success: "تمت أرشفة القضية",
      destructive: false,
      action: () => archiveCase(id),
    },
    delete: {
      title: "حذف القضية نهائياً؟",
      description: `ستُحذف القضية «${number}» نهائياً ولا يمكن التراجع. لو ليها جلسات أو مواعيد لن يتم الحذف، وعليك أرشفتها بدلاً من ذلك.`,
      label: "حذف نهائي",
      success: "تم حذف القضية",
      destructive: true,
      action: () => deleteCase(id),
    },
  } as const;

  const current = dialog ? confirm[dialog] : null;

  const runConfirm = () => {
    if (!current) return;
    startTransition(async () => {
      const result = await current.action();
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(current.success);
      setDialog(null);
    });
  };

  // restore is harmless, so no confirmation dialog
  const restore = () =>
    startTransition(async () => {
      const result = await restoreCase(id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("تم استرجاع القضية");
    });

  return (
    <>
      {/* modal={false}: otherwise the page can stay unclickable after a dialog opens from the menu */}
      <DropdownMenu modal={false} dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={pending}
            aria-label={`إجراءات القضية ${number}`}
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MoreVertical className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/cases/${id}/edit`}>
              <Pencil className="size-4" />
              تعديل
            </Link>
          </DropdownMenuItem>

          {archived ? (
            <DropdownMenuItem onSelect={restore}>
              <ArchiveRestore className="size-4" />
              استرجاع
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setDialog("archive")}
            >
              <Archive className="size-4" />
              أرشفة
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
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

      {/* outside the menu on purpose: it stays mounted when the menu closes */}
      <AlertDialog
        open={dialog !== null}
        onOpenChange={(next) => !pending && !next && setDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{current?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {current?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              className={buttonVariants({
                variant: current?.destructive ? "destructive" : "default",
              })}
              onClick={(e) => {
                e.preventDefault(); // keep it open until the server replies
                runConfirm();
              }}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {current?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
