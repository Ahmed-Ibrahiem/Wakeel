"use client";

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

type Props = {
  message: string | null; // dialog is open while there is a message
  onCancel: () => void;
  onConfirm: () => void;
};

export function HearingConflictDialog({ message, onCancel, onConfirm }: Props) {
  return (
    <AlertDialog
      open={message !== null}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>تعارض محتمل في المواعيد</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>رجوع</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            تأكيد وحفظ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}