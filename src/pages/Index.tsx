import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FounderSection } from "@/components/landing/FounderSection";
import { ViralThreadSection } from "@/components/landing/ViralThreadSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { InsightSection } from "@/components/landing/InsightSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { DifferentiationSection } from "@/components/landing/DifferentiationSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Footer } from "@/components/landing/Footer";
import { ProposalComparisonSection } from "@/components/landing/ProposalComparisonSection";



export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ViralThreadSection />
      <FounderSection />
      <ProblemSection />
      <InsightSection />
      <SolutionSection />
      <HowItWorksSection />
      <DifferentiationSection />
      <TestimonialsSection />
      <PricingSection />
      <ProposalComparisonSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
