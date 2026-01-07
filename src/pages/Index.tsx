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
import { DMHeroTeaser } from "@/components/landing/DMHeroTeaser";
import { DMFeaturesSection } from "@/components/landing/DMFeaturesSection";
import { DMFlowSection } from "@/components/landing/DMFlowSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* 1. HOOK - Grab attention */}
      <HeroSection />
      
      {/* 2. PROOF - Visual results */}
      <ProposalComparisonSection />
      
      {/* 3. CREDIBILITY - Why trust you */}
      <ViralThreadSection />
      <FounderSection />
      
      {/* 4. CORE VALUE - Main product explained */}
      <HowItWorksSection />
      
      {/* 5. DEEPER NARRATIVE - Problem/Solution */}
      <ProblemSection />
      <InsightSection />
      <SolutionSection />
      
      {/* 6. DIFFERENTIATION - Why you vs others */}
      <DifferentiationSection />
      
      {/* 7. SOCIAL PROOF */}
      <TestimonialsSection />
      
      {/* 8. BONUS/ADD-ON - DM Closer completes the system */}
      <DMHeroTeaser />
      <DMFeaturesSection />
      <DMFlowSection />
      
      {/* 9. INVESTMENT */}
      <PricingSection />
      
      {/* 10. OBJECTIONS */}
      <FAQSection />
      
      {/* 11. CLOSE */}
      <FinalCTASection />
      <Footer />
    </div>
  );
}
