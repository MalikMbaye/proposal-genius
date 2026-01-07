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
      <HeroSection />
      <ProposalComparisonSection />
      <ViralThreadSection />
      
      {/* Story flow: Intro to DM Closer - tease the problem before proposals */}
      <DMHeroTeaser />
      
      {/* Credibility: Who built this */}
      <FounderSection />
      
      {/* PitchGenius flow */}
      <HowItWorksSection />
      
      {/* DM Closer features - break up with visual */}
      <DMFeaturesSection />
      
      {/* Problem/Solution narrative */}
      <ProblemSection />
      <InsightSection />
      <SolutionSection />
      
      {/* Full DM Closer flow with CTA */}
      <DMFlowSection />
      
      {/* Differentiation and social proof */}
      <DifferentiationSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
