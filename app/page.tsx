import CtaBanner from "@/components/pages/home/CtaBanner";
import FeaturesSection from "@/components/pages/home/FeaturesSection";
import HeroSection from "@/components/pages/home/HeroSection";
import HowItWork from "@/components/pages/home/HowItWork";
import SystemPreviewSection from "@/components/pages/home/SystemPreviewSection";
import TrustSection from "@/components/pages/home/TrustSection";
import WhyUsSection from "@/components/pages/home/WhyUsSection";

const page = () => {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <WhyUsSection />
      <HowItWork />
      <SystemPreviewSection />
      <TrustSection />
      <CtaBanner />
    </main>
  );
};

export default page;
