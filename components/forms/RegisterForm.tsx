"use client";
import { FormProvider, useForm } from "react-hook-form";
import { InputWithLabel } from "../inputs/InputWithLabel";
import { Button } from "../ui/button";
import { BiLoaderAlt } from "react-icons/bi";
import { Field, FieldSeparator } from "../ui/field";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/server/users";
import { toast } from "sonner";
import { CheckboxWithLabel } from "../inputs/CheckboxWithLabel";
import { PhoneInput } from "../inputs/PhoneInput";
import { signUpSchema, SignUpValues } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import { PasswordWithLabel } from "../inputs/PasswordWithLabel";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      dialCode: "+20",
      name: "",
      phoneLocal: "",
      terms: false,
    },
  });

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        newUserCallbackURL: "/onboarding",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed In Successfully.");
          },
        },
      });
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || "Unknown Error");
      setLoading(false);
    }
  };

  const onSubmit = async (data: SignUpValues) => {
    const { success, message } = await signUp(data);

    if (success) {
      toast.success(message);
      router.push("/verify-email");
    } else {
      toast.error(message);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-7.5"
      >
        <div className="w-full grid grid-cols-1 xs:grid-cols-2 gap-5">
          <InputWithLabel<SignUpValues>
            fieldName="الإسم بالكامل"
            nameInSchema={"name"}
            disabled={loading}
          />
          <InputWithLabel<SignUpValues>
            fieldName="البريد الإلكتروني"
            nameInSchema={"email"}
            disabled={loading}
            dir="ltr"
          />
        </div>

        <PhoneInput<SignUpValues>
          label="رقم الهاتف"
          dialCodeName={"dialCode"}
          phoneName="phoneLocal"
          disabled={loading}
        />

        <div className="w-full grid grid-cols-1 xs:grid-cols-2 gap-5">
          <PasswordWithLabel<SignUpValues>
            fieldName="كلمة المرور"
            nameInSchema={"password"}
            disabled={loading}
          />
          <PasswordWithLabel<SignUpValues>
            fieldName="تأكيد كلمة المرور"
            nameInSchema={"confirmPassword"}
            disabled={loading}
          />
        </div>

        <CheckboxWithLabel<SignUpValues>
          className="me-2.5 "
          label={
            <>
              أوافق على{" "}
              <Link
                className="underline"
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link
                className="underline"
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                سياسة الخصوصية
              </Link>
            </>
          }
          nameInSchema={"terms"}
          disabled={loading}
          labelStyle="max-md:text-xs!"
        />
        <Button
          className="mx-auto text-lg! w-full h-12! max-h-12!"
          type="submit"
          disabled={loading || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <BiLoaderAlt className="animate-spin" />
          ) : (
            "إنشاء الحساب"
          )}
        </Button>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-lg">
          أو
        </FieldSeparator>

        <Field>
          <Button
            variant={"secondary"}
            className="mx-auto flex-center gap-2.5 h-12! max-h-12!"
            type="button"
            onClick={signInWithGoogle}
            disabled={loading || form.formState.isSubmitting}
          >
            <Image
              src={"/images/google.png"}
              alt="Google image"
              width={25}
              height={25}
            />
            <span> تسجيل بإستخدام جوجل</span>
          </Button>
        </Field>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
