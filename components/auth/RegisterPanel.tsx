import Image from "next/image";
import Logo from "../layout/Logo";
import { MdInsertChartOutlined } from "react-icons/md";
import { registerPageData } from "@/data/Ar";
import { IconType } from "react-icons/lib";
import { FaRegFolder, FaRegCalendar } from "react-icons/fa6";

const IconMap: Record<string, IconType> = {
  MdInsertChartOutlined,
  FaRegFolder,
  FaRegCalendar,
};

const RegisterPanel = () => {
  const content = registerPageData.registerPanel;
  return (
    <section
      className={`login-visual-panel w-full h-full relative  hidden lg:block`}
    >
      <div
        className="w-full h-full absolute inset-0
       after:absolute after:inset-0 after:w-full after:h-full after:bg-linear-to-t
       after:from-emerald-darker after:from-15% after:to-black/40   "
      >
        <Image
          src={"/images/decorations/auth.png"}
          alt="panner-image"
          fill
          className="object-cover"
          sizes="500"
        />
      </div>

      <div className="flex-col-start gap-10 w-full h-full relative z-10 p-18 ">
        <Logo
          titleStyle="text-white text-4xl!"
          iconProps={{ className: "text-emerald-light text-5xl mt-2" }}
        />
        <div className="flex-col-center gap-5">
          <h1 className="text-primary-foreground max-w-90 -mr-7.5!">
            {content.title.split(" ").map((word, index) =>
              content.heighLightS.includes(word.trim()) ? (
                <span key={index} className="text-emerald-light">
                  {word}{" "}
                </span>
              ) : (
                `${word} `
              ),
            )}
          </h1>
          <p className="text-gray-300 max-w-100">{content.desc}</p>
        </div>

        <ul className=" flex-col-start gap-7.5 w-full mt-5">
          {content.items.map((item, index) => {
            const Icon = IconMap[`${item.iconName}`];
            return (
              <li key={index} className={`flex-start gap-5 `}>
                <div className="w-15 h-15 bg-sidebar-accent-foreground/60 flex-center rounded-full">
                  <Icon className="text-primary-foreground text-3xl" />
                </div>
                <div className="flex-col-start gap-2.5">
                  <h4 className="text-primary-foreground">{item.title}</h4>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default RegisterPanel;
