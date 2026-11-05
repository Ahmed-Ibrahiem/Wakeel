import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import OnboardingForm from "@/components/forms/OnboardingForm";
import Logo from "@/components/layout/Logo";
import Image from "next/image";
import { FaUser } from "react-icons/fa6";

export default async function OnboardingPage() {
  const session = await requireSession();
  if (session.user.phone) redirect("/dashboard");

  return (
    <main
      className=" bg-cover! bg-top! w-full! min-h-screen bg-no-repeat! flex flex-col gap-5"
      style={{ background: "url('/images/decorations/onboarding_bg.png')" }}
    >
      <header className="w-full flex-between gap-5 p-6 px-15 ">
        <div className="flex-start gap-2.5 ">
          <div className="w-14 h-14 rounded-full flex-center overflow-hidden bg-accent">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={72}
                height={72}
              />
            ) : (
              <FaUser size={30} className="text-primary" />
            )}
          </div>
            <h2 className="text-lg">{session.user.name.split(" ").slice(0 , 2).join(" ")}</h2>
        </div>
        <Logo />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 grow">
        <OnboardingForm />
        <div
          className="pannel bg-cover! bg-center!  w-full h-full "
          style={{
            background: "url('/images/decorations/onboarding_pannel.png')",
          }}
        ></div>
      </section>
    </main>
  );
}
