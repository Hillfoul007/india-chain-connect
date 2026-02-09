import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PillarsSection from "@/components/PillarsSection";
import BeneficiariesSection from "@/components/BeneficiariesSection";
import WhySection from "@/components/WhySection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div id="pillars"><PillarsSection /></div>
      <div id="impact"><BeneficiariesSection /></div>
      <div id="why"><WhySection /></div>
      <div id="mvp"><CTASection /></div>
      <Footer />
    </div>
  );
};

export default Index;
