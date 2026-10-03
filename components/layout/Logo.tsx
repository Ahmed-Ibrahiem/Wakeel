import { ComponentProps } from "react";
import { MdOutlineBalance } from "react-icons/md";
import Link from "next/link";

const Logo = ({
  titleStyle,
  iconProps,
}: {
  titleStyle?: string;
  iconProps?: ComponentProps<typeof MdOutlineBalance>;
}) => {
  return (
    <Link href={"/"} className="flex-start gap-2">
      <MdOutlineBalance className="text-4xl text-primary" {...iconProps} />
      <h1
        className={`text-primary-dark font-extrabold text-[28px] ${titleStyle ?? ""}`}
      >
        وكيل
      </h1>
    </Link>
  );
};

export default Logo;
