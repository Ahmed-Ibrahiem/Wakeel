import { loginPage } from "@/data/Ar";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import Logo from "../layout/Logo";
import LoginForm from "../forms/LoginForm";

const LoginSection = () => {
  const content = loginPage.login_form;
  return (
    <section className="login-form-panel bg-accent/40 flex-col-start gap-5 px-5 py-5 sm:px-15 flex flex-col justify-center h-full">
      <div className="flex-start gap-3.5">
        <p className="text-[16px]">{content.has_no_account.label}</p>
        <Link
          className="text-primary flex-start font-bold gap-2"
          href={"/register"}
        >
          {content.has_no_account.href_title}{" "}
          <FaArrowLeft className="mt-1" />{" "}
        </Link>
      </div>
      <div className="w-full bg-background rounded-sm shadow-sm border p-5 md:p-10 flex-col-center gap-5">
        {/* Section Header */}
        <div className="flex-col-center text-center gap-7.5">
          <div>
            <h2 className=" mb-1.5">{content.form.title}</h2>
            <p className="">{content.form.desc}</p>
          </div>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </section>
  );
};

export default LoginSection;
