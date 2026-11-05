import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import Logo from "@/components/layout/Logo";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

export default function ForgotPasswordPage() {
  return (
    <main
      className=" bg-cover! bg-top! w-full! min-h-screen bg-no-repeat! flex flex-col gap-5"
      style={{ background: "url('/images/decorations/onboarding_bg.png')" }}
    >
      <header className="w-full flex-between gap-5 p-6 px-15 flex-wrap-reverse">
        <Link href="/login" className="flex-start gap-2.5 font-bold">
          <span>العودة إلي صفحة تسجيل الدخول</span>
          <FaArrowLeft className="max-md:hidden" />
        </Link>
        <Logo />
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 grow">
        <ForgotPasswordForm />
        <div
          className="pannel bg-cover! bg-center! max-lg:hidden w-full h-full "
          style={{
            background: "url('/images/decorations/onboarding_pannel.png')",
          }}
        ></div>
      </section>
    </main>
  );
}
