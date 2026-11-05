"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { resetPassword } from "@/server/password";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validations/auth";
import { MdLockReset } from "react-icons/md";
import { PasswordWithLabel } from "../inputs/PasswordWithLabel";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    const res = await resetPassword(data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    router.replace("/login");
  };

  return (
    <div className="w-full h-full px-5 md:px-15 py-10 ">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-7.5 card"
        >
          <div className="w-full flex-col-center gap-2.5 text-center">
            <MdLockReset className="text-primary" size={60} />
            <h1>تعيين كلمة المرور</h1>
            <p>قم بإدخال كلمة المرور الجديدة لحسابك</p>
          </div>
          <PasswordWithLabel<ResetPasswordValues>
            fieldName="كلمة المرور الجديدة"
            nameInSchema="password"
          />
          <PasswordWithLabel<ResetPasswordValues>
            fieldName="تأكيد كلمة المرور"
            nameInSchema="confirmPassword"
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            تغيير كلمة المرور
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
