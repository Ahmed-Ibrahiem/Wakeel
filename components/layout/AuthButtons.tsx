import { Button } from "@/components/ui/button";
import { homePage } from "@/data/Ar";

const AuthButtons = () => {
  const content = homePage.authButton;
  return (
    <div className="flex-start gap-2 sm:gap-5">
      <Button>{content.login}</Button>
      <Button variant={"secondary"}>{content.startNow}</Button>
    </div>
  );
};

export default AuthButtons;
