"use client";

import { useState, useTransition } from "react";
import { Archive, ArchiveRestore, Loader2, Trash2 } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { archiveClient, deleteClient, restoreClient } from "../actions";
import { useRouter } from "next/navigation";

type Result = { success: true } | { success: false; message: string };

type ConfirmProps = {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  confirmLabel: string;
  successMessage: string;
  destructive?: boolean;
  onConfirm: () => Promise<Result>;
  onSuccess?: () => void;
};

function ConfirmButton({
  icon,
  label,
  title,
  description,
  confirmLabel,
  successMessage,
  destructive,
  onConfirm,
  onSuccess,
}: ConfirmProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const run = () =>
    startTransition(async () => {
      const result = await onConfirm();
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(successMessage);
      setOpen(false);
      onSuccess?.();
    });

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label}>
          {icon}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className={buttonVariants({
              variant: destructive ? "destructive" : "default",
            })}
            onClick={(e) => {
              e.preventDefault(); // نمنع القفل التلقائي لحد ما السيرفر يرد
              run();
            }}
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RestoreButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  // الاسترجاع مش خطر، فمن غير نافذة تأكيد
  const run = () =>
    startTransition(async () => {
      const result = await restoreClient(id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("تم استرجاع العميل");
    });

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`استرجاع ${name}`}
      disabled={pending}
      onClick={run}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <ArchiveRestore className="size-4" />
      )}
    </Button>
  );
}

export function ClientRowActions({
  id,
  name,
  archived,
  afterDeleteHref,
}: {
  id: string;
  name: string;
  archived: boolean;
  afterDeleteHref?: string; // where to go after a delete (used on the details page)
}) {
  const router = useRouter();
  return (
    <>
      {archived ? (
        <RestoreButton id={id} name={name} />
      ) : (
        <ConfirmButton
          icon={<Archive className="size-4" />}
          label={`أرشفة ${name}`}
          title="أرشفة العميل؟"
          description={`سيختفي «${name}» من قائمة العملاء، وتبقى بياناته وقضاياه محفوظة، وتقدر ترجّعه من تبويب المؤرشفين.`}
          confirmLabel="أرشفة"
          successMessage="تمت الأرشفة"
          onConfirm={() => archiveClient(id)}
        />
      )}
      <ConfirmButton
        icon={<Trash2 className="size-4 text-destructive" />}
        label={`حذف ${name}`}
        title="حذف العميل نهائياً؟"
        description={`سيُحذف «${name}» نهائياً ولا يمكن التراجع. لو عنده قضايا لن يتم الحذف، وعليك أرشفته بدلاً من ذلك.`}
        confirmLabel="حذف نهائي"
        successMessage="تم حذف العميل"
        destructive
        onConfirm={() => deleteClient(id)}
        onSuccess={
          afterDeleteHref ? () => router.push(afterDeleteHref) : undefined
        }
      />
    </>
  );
}
