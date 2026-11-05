"use client";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { requestPasswordReset } from "@/server/password";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validations/auth";
import { MdLockReset } from "react-icons/md";
import { FieldSeparator } from "../ui/field";
import { FaArrowLeft } from "react-icons/fa6";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    const res = await requestPasswordReset(data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    setMessage(res.message);
  };

  if (message) {
    return (
      <div className="w-full h-full px-5 md:px-15 flex-center">
        <div className="text-center card">
          <h4 className="mb-6">{message}</h4>
          <Link href="/login" className="flex-start gap-2.5 font-bold">
            <span>العودة إلي صفحة تسجيل الدخول</span>
            <FaArrowLeft className="max-md:hidden" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full  p-10 px-5 md:px-15">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-7.5 card "
        >
          <div className="w-full flex-col-center gap-2.5 text-center">
            <MdLockReset className="text-primary" size={60} />
            <h1>إعادة تعيين كلمة المرور</h1>
            <p>
              أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
              الخاصة بك.
            </p>
          </div>
          <InputWithLabel<ForgotPasswordValues>
            fieldName="البريد الإلكتروني"
            nameInSchema="email"
            type="email"
            autoComplete="email"
            dir="ltr"
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            إرسال رابط إعادة التعيين
          </Button>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-lg">
            أو
          </FieldSeparator>
          <Link href="/login" className="flex-start gap-2.5 font-bold">
            <span>العودة إلي صفحة تسجيل الدخول</span>
            <FaArrowLeft />
          </Link>
        </form>
      </FormProvider>
    </div>
  );
}
