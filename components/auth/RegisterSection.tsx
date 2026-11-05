import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { registerPageData } from "@/data/Ar";
import RegisterForm from "@/components/forms/RegisterForm";

const RegisterSection = () => {
  const content = registerPageData.register_form;
  return (
    <section className="login-form-panel bg-accent/40 flex-col-start gap-5 px-5 py-5 sm:px-15 flex flex-col justify-center h-full">
      <div className="flex-start gap-2.5 flex-wrap">
        <p className="text-[16px] max-sm:text-sm">
          {content.has_account.label}
        </p>
        <Link
          className="text-primary flex-start font-bold gap-2 max-sm:text-sm"
          href={"/login"}
        >
          {content.has_account.href_title} <FaArrowLeft className="mt-1" />{" "}
        </Link>
      </div>
      <div className="w-full bg-background rounded-sm shadow-sm border p-5 flex-col-center gap-5">
        {/* Section Header */}
        <div className="flex-col-center text-center gap-2.5 ">
          <div>
            <h2 className=" mb-1.5">{content.form.title}</h2>
            <p>{content.form.desc}</p>
          </div>
        </div>

        {/* Login Form */}
        <RegisterForm />
      </div>
    </section>
  );
};

export default RegisterSection;
