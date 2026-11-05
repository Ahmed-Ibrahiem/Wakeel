"use client";
import { onboardingSchema, OnboardingValues } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { PhoneInput } from "../inputs/PhoneInput";
import { CheckboxWithLabel } from "../inputs/CheckboxWithLabel";
import Link from "next/link";
import { Button } from "../ui/button";
import { completeOnboarding } from "@/server/onboarding";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LuContact, LuShieldCheck } from "react-icons/lu";

const OnboardingForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      dialCode: "+20",
      phoneLocal: "",
      terms: true,
    },
  });

  const onSubmit = async (data: OnboardingValues) => {
    const { success, message } = await completeOnboarding(data);

    if (success) {
      toast.success(message);
      router.push("/dashboard");
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="h-full w-full  p-10 px-15">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-col-start gap-7.5 card p-10 rounded-sm w-full"
        >
          <div className="flex-col-center gap-2.5 w-full ">
            <LuContact size={70} className="text-primary" />
            <h1>أكمل بياناتك</h1>
            <p className="text-center">
              يرجي إضافة رقم الهاتف الخاصة بك والموافقة علي الشروط والأحكام
              وسياسة الخصوصية
            </p>
          </div>
          <PhoneInput<OnboardingValues>
            label="رقم الهاتف"
            dialCodeName="dialCode"
            phoneName="phoneLocal"
          />
          <CheckboxWithLabel<OnboardingValues>
            nameInSchema="terms"
            className="me-2.5"
            label={
              <>
                أوافق على{" "}
                <Link className="underline" href="/terms" target="_blank">
                  الشروط والأحكام
                </Link>{" "}
                و
                <Link className="underline" href="/privacy" target="_blank">
                  سياسة الخصوصية
                </Link>
              </>
            }
          />
          <Button
            className=" w-full text-lg! h-12! max-h-12!"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            متابعة
          </Button>
          <div className="w-full flex-center gap-1.5">
            <LuShieldCheck className="text-primary" size={30}/>
            <p>معلوماتك أمنة ومحمية لدينا</p>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default OnboardingForm;
