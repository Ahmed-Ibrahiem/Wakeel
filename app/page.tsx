import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CtaBanner from "@/components/pages/landing/CtaBanner";
import FeaturesSection from "@/components/pages/landing/FeaturesSection";
import HeroSection from "@/components/pages/landing/HeroSection";
import HowItWork from "@/components/pages/landing/HowItWork";
import SystemPreviewSection from "@/components/pages/landing/SystemPreviewSection";
import TrustSection from "@/components/pages/landing/TrustSection";
import WhyUsSection from "@/components/pages/landing/WhyUsSection";

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
