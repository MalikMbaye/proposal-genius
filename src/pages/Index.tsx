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
import { DMProblemSection } from "@/components/landing/DMProblemSection";
import { DMHeroTeaser } from "@/components/landing/DMHeroTeaser";
import { DMFlowSection } from "@/components/landing/DMFlowSection";
import { SocialProofToast } from "@/components/SocialProofToast";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { PromoBanner } from "@/components/landing/PromoBanner";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Conversion optimization components */}
      <SocialProofToast />
      <ExitIntentPopup />
      
      {/* Promotional Banner - $100K Giveaway */}
      <PromoBanner />
      
      <Navbar />
      
      {/* ========================================
          PHASE 1: HOOK & CREDIBILITY
          Goal: Grab attention, establish trust
      ======================================== */}
      <HeroSection />
      <ProposalComparisonSection />
      <ViralThreadSection />
      <FounderSection />
      
      {/* ========================================
          PHASE 2: PITCHGENIUS CORE VALUE
          Goal: Explain the main product fully
      ======================================== */}
      <HowItWorksSection />
      <ProblemSection />
      <InsightSection />
      <SolutionSection />
      
      {/* ========================================
          PHASE 3: DIFFERENTIATION & PROOF
          Goal: Handle "why you?" objection
      ======================================== */}
      <DifferentiationSection />
      <TestimonialsSection />
      
      {/* ========================================
          PHASE 4: DM CLOSER (BONUS/ADD-ON)
          Goal: "But wait, there's more" - complete the system
          
          Story arc:
          1. Problem (graph) - You're bleeding money in DMs
          2. Solution (mockup) - Here's the fix
          3. How + Proof (3-step + stats) - It's easy & proven
      ======================================== */}
      <DMProblemSection />
      <DMHeroTeaser />
      <DMFlowSection />
      
      {/* ========================================
          PHASE 5: CLOSE THE DEAL
          Goal: Investment, objections, final push
      ======================================== */}
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
