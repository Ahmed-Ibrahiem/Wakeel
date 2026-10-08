import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CtaBanner from "@/components/pages/home/CtaBanner";
import FeaturesSection from "@/components/pages/home/FeaturesSection";
import HeroSection from "@/components/pages/home/HeroSection";
import HowItWork from "@/components/pages/home/HowItWork";
import SystemPreviewSection from "@/components/pages/home/SystemPreviewSection";
import TrustSection from "@/components/pages/home/TrustSection";
import WhyUsSection from "@/components/pages/home/WhyUsSection";

const page = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WhyUsSection />
        <HowItWork />
        <SystemPreviewSection />
        <TrustSection />
        <CtaBanner />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default page;
