import Image from "next/image";
import { FaRegFileAlt } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import { LuShieldCheck } from "react-icons/lu";
import Logo from "../layout/Logo";
import { loginPage } from "@/data/Ar";
import { IconType } from "react-icons/lib";

const IconMap: Record<string, IconType> = {
  FaRegFileAlt,
  BsLightningCharge,
  LuShieldCheck,
};

const LoginPanel = () => {
  const content = loginPage.login_panel;
  return (
    <section
      className={`login-visual-panel w-full h-full relative text-center hidden lg:block`}
    >
      <div
        className="w-full h-full absolute inset-0
       after:absolute after:inset-0 after:w-full after:h-full after:bg-linear-to-t
       after:from-emerald-darker after:from-10% to-white   "
      >
        <Image
          src={"/images/decorations/auth.png"}
          alt="panner-image"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-col-between gap-5 w-full h-full relative z-10 p-5 py-18 ">
         <Logo
          titleStyle="text-white text-4xl!"
          iconProps={{ className: "text-emerald-light text-5xl mt-2" }}
        />
        <div className="flex-col-center gap-6">
          <h1 className="text-primary-foreground ">{content.title}</h1>
          <h1 className="text-emerald-light">{content.heighLight}</h1>
          <p className="text-gray-300 max-w-100">{content.desc}</p>
        </div>

        <ul className=" grid grid-cols-3 w-full mt-5">
          {content.items.map((item, index) => {
            const Icon = IconMap[`${item.iconName}`];
            return (
              <li
                key={index}
                className={`flex-col-center gap-5 p-5 ${index == 1 ? "border-x " : ""}`}
              >
                <Icon className="text-primary-foreground text-3xl" />
                <h3 className="text-primary-foreground">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default LoginPanel;
