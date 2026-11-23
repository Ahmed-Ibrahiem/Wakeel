"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { FormSection } from "@/components/shared/FormSection";
import { deleteAccount } from "../actions";
import { deleteAccountSchema, type DeleteAccountValues } from "../schemas";

export function DeleteAccountSection({ hasPassword }: { hasPassword: boolean }) {
  const [open, setOpen] = useState(false);
  const form = useForm<DeleteAccountValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "", confirmation: "" },
  });
  const { isSubmitting } = form.formState;

  const onOpenChange = (next: boolean) => {
    if (isSubmitting) return; // cannot be closed while deleting
    setOpen(next);
    if (!next) form.reset();
  };

  const onSubmit = async (values: DeleteAccountValues) => {
    const result = await deleteAccount(values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    // The session is gone: a full page load leaves nothing stale on screen
    window.location.assign("/");
  };

  return (
    <FormSection title="حذف الحساب" icon={Trash2} className="p-6!">
      <p className="mb-4 text-sm text-muted-foreground">
        يحذف هذا الإجراء حسابك وكل بياناتك (العملاء والقضايا والجلسات والمواعيد)
        نهائياً، ولا يمكن التراجع عنه.
      </p>

      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="rounded-sm! h-10">
            <Trash2 className="size-4" />
            حذف الحساب
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل تريد حذف حسابك نهائياً؟</AlertDialogTitle>
            <AlertDialogDescription>
              ستُحذف كل بياناتك فوراً ولا يمكن استرجاعها.
              {!hasPassword &&
                " إذا سجّلت الدخول منذ فترة، فسيُطلب منك تسجيل الدخول من جديد قبل الحذف."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {hasPassword && (
                <InputWithLabel<DeleteAccountValues>
                  fieldName="كلمة المرور"
                  nameInSchema="password"
                  type="password"
                  dir="ltr"
                  autoComplete="current-password"
                />
              )}
              <InputWithLabel<DeleteAccountValues>
                fieldName="اكتب كلمة «حذف» للتأكيد"
                nameInSchema="confirmation"
                autoComplete="off"
              />

              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel disabled={isSubmitting}>إلغاء</AlertDialogCancel>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  حذف الحساب نهائياً
                </Button>
              </AlertDialogFooter>
            </form>
          </FormProvider>
        </AlertDialogContent>
      </AlertDialog>
    </FormSection>
  );
}