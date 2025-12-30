import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { BrandLogosSection } from "@/components/landing/BrandLogosSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { InsightSection } from "@/components/landing/InsightSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { FundingLogosSection } from "@/components/landing/FundingLogosSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FounderSection } from "@/components/landing/FounderSection";
import { PressLogosSection } from "@/components/landing/PressLogosSection";
import { DifferentiationSection } from "@/components/landing/DifferentiationSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { AlumniLogosSection } from "@/components/landing/AlumniLogosSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Footer } from "@/components/landing/Footer";



export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <BrandLogosSection />
      <FounderSection />
      <ProblemSection />
      <InsightSection />
      <SolutionSection />
      <FundingLogosSection />
      <HowItWorksSection />
      <PressLogosSection />
      <DifferentiationSection />
      <TestimonialsSection />
      <AlumniLogosSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
      
    </div>
  );
}
