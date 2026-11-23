"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { FormSection } from "@/components/shared/FormSection";
import { changePassword } from "../actions";
import { changePasswordSchema, type ChangePasswordValues } from "../schemas";
import { PasswordWithLabel } from "@/components/inputs/PasswordWithLabel";

export function ChangePasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ChangePasswordValues) => {
    const result = await changePassword(values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("تم تغيير كلمة المرور، وتم تسجيل الخروج من بقية الأجهزة");
    form.reset();
  };

  return (
    <FormSection title="كلمة المرور" icon={KeyRound} className="p-6!">
      {!hasPassword ? (
        <p className="text-sm text-muted-foreground">
          حسابك مرتبط بحساب جوجل، لذلك لا توجد له كلمة مرور في وكيل. يمكنك
          إدارة أمان حسابك من إعدادات جوجل.
        </p>
      ) : (
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-3">
              <PasswordWithLabel<ChangePasswordValues>
                fieldName="كلمة المرور الحالية"
                nameInSchema="currentPassword"
                autoComplete="current-password"
              />
              <PasswordWithLabel<ChangePasswordValues>
                fieldName="كلمة المرور الجديدة"
                nameInSchema="newPassword"
                autoComplete="new-password"
              />
              <PasswordWithLabel<ChangePasswordValues>
                fieldName="تأكيد كلمة المرور الجديدة"
                nameInSchema="confirmPassword"
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="rounded-sm! h-10"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}
              تغيير كلمة المرور
            </Button>
          </form>
        </FormProvider>
      )}
    </FormSection>
  );
}