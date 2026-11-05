import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import Logo from "@/components/layout/Logo";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

    if (!token || error) {
      return (
        <main className="mx-auto max-w-md p-6 text-center">
          <h1 className="mb-3 text-2xl font-bold">الرابط غير صالح</h1>
          <p className="mb-6 text-muted-foreground">
            الرابط منتهي أو غير صحيح. اطلب رابطاً جديداً.
          </p>
          <Link href="/forgot-password" className="underline">
            طلب رابط جديد
          </Link>
        </main>
      );
    }

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
        <ResetPasswordForm token={token} />
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
