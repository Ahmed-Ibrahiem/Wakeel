import Logo from "@/components/layout/Logo";
import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import { LuShieldCheck } from "react-icons/lu";

const IconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  FaRegFileAlt,
  BsLightningCharge,
  LuShieldCheck,
};

const loginContent = {
  title: "شريكك في إدارة ",
  heighLight: "قضاياك القانونية",
  desc: "منصة وكيل تساعدك علي متابعة قضاياك وجلساتك وإدارة أعمالك القانونية بكل سهولة وإحترافية.",
  items: [
    {
      iconName: "FaRegFileAlt",
      title: "إدارة شاملة",
      desc: "لكل قضاياك",
    },
    {
      iconName: "BsLightningCharge",
      title: "سهولة الإستخدام",
      desc: "في كل وقت",
    },
    {
      iconName: "LuShieldCheck",
      title: "أمان عالي",
      desc: "لحماية بياناتك",
    },
  ],
};

const page = () => {
  const content = loginContent;

  return (
    <main className="w-full h-full grid grid-cols-2">
      <section className="login-form-panel">{/* Login form */}</section>

      <section className="login-visual-panel ">
        {/* Logo / illustration / marketing content */}
        {/* Logo */}
        <Logo />
        <h1>{content.title}</h1>
        <p>{content.desc}</p>

        {content.items.map((item, index) => {
          const Icon = IconMap[`${item.iconName}`];
          return (
            <div key={index} className="flex-col-center gap-5">
              <Icon size={20} />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default page;
