"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "../ui/button";
import Link from "next/link";
import { Field, FieldSeparator } from "../ui/field";
import { BiLoaderAlt } from "react-icons/bi";
import Image from "next/image";
import { signIn } from "@/server/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema, SignInValues } from "@/lib/validations/auth";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { PasswordWithLabel } from "../inputs/PasswordWithLabel";

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
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
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SignInValues) => {
    const { success, message } = await signIn(data);

    if (success) {
      toast.success(message);
      router.push("/dashboard");
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
        <InputWithLabel<SignInValues>
          fieldName="البريد الإلكتروني"
          nameInSchema={"email"}
          dir="ltr"
          disabled={loading}
        />

        <PasswordWithLabel<SignInValues>
          fieldName="كلمة المرور"
          nameInSchema={"password"}
          disabled={loading}
        />

        <Link
          className="self-end underline font-semibold"
          href="/forgot-password"
        >
          نسيت كلمة المرور؟
        </Link>

        <Button
          className="mx-auto text-lg! w-full h-12! max-h-12!"
          type="submit"
          disabled={loading || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <BiLoaderAlt className="animate-spin" />
          ) : (
            "تسجيل دخول"
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
            <span> متابعة بإستخدام جوجل</span>
          </Button>
        </Field>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
