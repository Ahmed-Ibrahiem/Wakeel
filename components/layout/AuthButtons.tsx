import { Button } from "@/components/ui/button";
import { homePage } from "@/data/Ar";
import Link from "next/link";

const AuthButtons = () => {
  const content = homePage.authButton;
  return (
    <div className="flex-start gap-2 sm:gap-5">
      <Button>
        <Link href={"/login"} className=" text-white">
          {content.login}
        </Link>
      </Button>
      <Button variant={"secondary"}>
        <Link href={"/register"}>{content.startNow}</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
