import Link from "next/link";

const VerifyEmail = () => {
  return (
    <main className="mx-auto max-w-sm p-6 text-center">
      <h1 className="mb-3 text-2xl font-bold">تحقق من بريدك الإلكتروني</h1>
      <p className="mb-2 text-muted-foreground">
        أرسلنا لك رابط تفعيل. اضغط عليه لإكمال إنشاء حسابك.
      </p>
      <p className="mb-6 text-sm text-muted-foreground">
        اذا لم يصلك رابط تأكيد الحساب ، يرجي التحقق من صندوق الرسائل الغير
        مرغوبة ، او حاول تسجيل دخول مرة أخري وسنرسل لك رابط التأكيد مجددا.{" "}
      </p>
      <Link href="/login" className="underline">
        العودة لتسجيل الدخول
      </Link>
    </main>
  );
};

export default VerifyEmail;
