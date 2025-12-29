import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Logo } from "@/components/Logo";
import { ProgressStepper } from "@/components/ProgressStepper";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { GeneratingLoader } from "@/components/GeneratingLoader";
import {
  useProposalStore,
  caseStudies,
  proposalLengths,
} from "@/lib/proposalStore";
import { ArrowLeft, ArrowRight, ExternalLink, Lightbulb, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function Generate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSteps, setGeneratingSteps] = useState<
    { label: string; status: "pending" | "active" | "completed" }[]
  >([
    { label: "Creating proposal structure", status: "pending" },
    { label: "Writing executive summary", status: "pending" },
    { label: "Drafting contract terms", status: "pending" },
    { label: "Composing follow-up emails", status: "pending" },
  ]);

  const {
    clientContext,
    setClientContext,
    background,
    setBackground,
    selectedCaseStudies,
    toggleCaseStudy,
    proposalLength,
    setProposalLength,
    pricingStrategy,
    setPricingStrategy,
    pricingAI,
    setPricingAI,
    pricingManaged,
    setPricingManaged,
    setDeliverables,
  } = useProposalStore();

  const steps = [
    { label: "Context", completed: currentStep > 1, active: currentStep === 1 },
    { label: "Options", completed: currentStep > 2, active: currentStep === 2 },
    { label: "Generate", completed: false, active: currentStep === 3 },
  ];

  const canProceedStep1 = clientContext.trim().length > 20;
  const canProceedStep2 = selectedCaseStudies.length > 0 && background.trim().length > 0;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate generation process
    for (let i = 0; i < generatingSteps.length; i++) {
      setGeneratingSteps((prev) =>
        prev.map((step, idx) => ({
          ...step,
          status: idx === i ? "active" : idx < i ? "completed" : "pending",
        }))
      );
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    // Set all to completed
    setGeneratingSteps((prev) =>
      prev.map((step) => ({ ...step, status: "completed" as const }))
    );

    // Mock deliverables
    setDeliverables({
      proposal: `# Project Proposal

## Executive Summary

This proposal outlines our comprehensive plan for your upcoming project. Based on our initial discovery and analysis, we have developed a strategic roadmap aimed at enhancing user experience, increasing conversion rates, and aligning with your 2025 growth objectives.

Our approach integrates cutting-edge technologies, including AI-driven personalization and a modular design system, to ensure scalability and competitive advantage. The project timeline is estimated at 12 weeks, with distinct phases for discovery, design, development, and deployment.

We are committed to delivering a high-quality solution that not only meets but exceeds your expectations. Detailed scope of work, deliverables, and budget breakdown are provided in the subsequent sections.

## Scope of Work

Phase 1: Discovery and Strategy (Weeks 1-2). This phase involves deep-dive workshops, stakeholder interviews, and user persona definition. We will also conduct a comprehensive audit of the existing platform.

Phase 2: Design and Prototyping (Weeks 3-5). Creating wireframes, high-fidelity mockups, and interactive prototypes for user testing and validation.

Phase 3: Development (Weeks 6-10). Full-stack development including frontend, backend, and API integrations.

Phase 4: Testing and Launch (Weeks 11-12). Comprehensive QA testing, performance optimization, and production deployment.

## Investment Options

### Option 1: Strategy & Training — ${pricingStrategy}
You receive the complete strategy playbook and training to execute with your team.

### Option 2: Strategy + AI Systems — ${pricingAI}
Full strategy plus automated lead generation systems built and configured.

### Option 3: Fully Managed — ${pricingManaged}
We handle everything. You focus on closing deals while we drive growth.

## Why Us

${background}

## Next Steps

1. Review this proposal and share feedback
2. Schedule a 30-minute call to discuss questions
3. Sign the contract and we begin Week 1

We look forward to partnering with you on this exciting initiative.`,
      deckPrompt: `Create a professional pitch deck presentation with the following slides:

**Slide 1: Title Slide**
- Title: "[Client Name] Growth Partnership Proposal"
- Subtitle: "Strategic roadmap to achieve your 2025 goals"
- Your logo and date

**Slide 2: The Challenge**
- Current situation and pain points
- Market context and competitive landscape
- The cost of inaction

**Slide 3: Why This Matters**
- Impact on revenue and growth
- Team efficiency considerations
- Long-term strategic implications

**Slide 4: Our Approach**
- Overview of methodology
- Key differentiators
- Expected outcomes

**Slide 5-7: Solution Details**
- Phase 1: Discovery & Strategy
- Phase 2: Implementation
- Phase 3: Optimization & Scale

**Slide 8: Timeline**
- Visual roadmap with milestones
- Key deliverables at each stage
- Dependencies and checkpoints

**Slide 9: Investment Options**
- Three pricing tiers
- What's included in each
- ROI projections

**Slide 10: Why Us**
- Relevant case studies
- Team credentials
- Client testimonials

**Slide 11: Next Steps**
- Clear call to action
- Contact information
- Meeting scheduling

Design Direction: Modern, clean, professional. Use a dark theme with accent colors. Incorporate data visualizations and minimal text per slide.`,
      contract: `# PROFESSIONAL SERVICES AGREEMENT

This Professional Services Agreement ("Agreement") is entered into as of [DATE], by and between:

**Contractor:** [YOUR NAME/COMPANY]
**Client:** [CLIENT NAME/COMPANY]

## 1. SCOPE OF WORK

Contractor agrees to provide the following services:
- Strategic growth consultation and planning
- System design and implementation
- Training and documentation
- Ongoing optimization support

Detailed deliverables are outlined in the attached Proposal Document.

## 2. TIMELINE AND MILESTONES

Project duration: 12 weeks
Start date: [START DATE]
End date: [END DATE]

Key milestones:
- Week 2: Strategy document delivery
- Week 5: Design approval
- Week 10: Development complete
- Week 12: Launch and handoff

## 3. CONTRACTOR RESPONSIBILITIES

✓ Deliver all work according to agreed timelines
✓ Provide regular progress updates (weekly)
✓ Maintain professional communication standards
✓ Ensure quality and accuracy of all deliverables
✓ Provide 30 days post-launch support

## 4. CLIENT RESPONSIBILITIES

✓ Provide timely feedback (within 48 hours)
✓ Ensure stakeholder availability for meetings
✓ Provide access to necessary systems and data
✓ Make payments according to agreed schedule
✓ Designate a single point of contact

## 5. WHAT SUCCESS REQUIRES

Both parties acknowledge that project success depends on:
- Clear and consistent communication
- Timely decision-making
- Commitment to the agreed timeline
- Honest feedback and collaboration

Systems may fail when:
- Messaging is unclear or inconsistent
- Offer doesn't resonate with market
- Volume is insufficient for testing
- Optimization is neglected post-launch

## 6. INVESTMENT

${pricingAI}

Payment schedule:
- 50% upon contract signing
- 25% at midpoint milestone
- 25% upon project completion

## 7. WARRANTY

This is a SYSTEM BUILD, not a guarantee of specific business outcomes.

We guarantee:
✓ Professional quality work
✓ Adherence to agreed specifications
✓ Timely delivery per milestones
✓ Post-launch support period

We do NOT guarantee:
✗ Specific revenue or lead numbers
✗ Third-party platform performance
✗ Results dependent on client execution

## SIGNATURES

Contractor: _________________________ Date: _______

Client: _________________________ Date: _______`,
      contractEmail: `Subject: Contract Ready for Review — [Project Name]

Hi [Client Name],

Following our proposal discussion, I've attached the contract for your review.

Key points to note:
- Project timeline: 12 weeks starting [DATE]
- Investment: ${pricingAI} with milestone-based payments
- 30-day post-launch support included

The contract outlines responsibilities for both parties to ensure we're aligned on expectations and set up for success.

Please review when you have a moment. I'm happy to hop on a quick call if you have any questions or need clarification on any terms.

Looking forward to getting started.

Best,
[Your Name]`,
      invoiceDescription: `Professional Services — Growth Strategy & Implementation

Scope: Strategic consultation, system design, implementation, and optimization
Timeline: 12-week engagement
Phase: [CURRENT PHASE]

Includes:
- Discovery and strategy development
- System design and build
- Training and documentation
- 30-day post-launch support`,
      proposalEmail: `Subject: Your Growth Proposal — Ready for Review

Hi [Client Name],

Great speaking with you yesterday! As promised, I've put together a comprehensive proposal package based on our discussion.

**What's Inside:**
1. Full Proposal Document — Detailed scope, timeline, and investment options
2. Presentation Deck — Visual overview for your team
3. Contract Template — Ready for review when you're ready to proceed

**Quick Recap of What We Discussed:**
- Current challenge: [CHALLENGE]
- Goal: [GOAL]
- Timeline: Looking to launch within [TIMEFRAME]

**Investment Options:**
- Strategy & Training: ${pricingStrategy}
- Strategy + AI Systems: ${pricingAI}
- Fully Managed: ${pricingManaged}

**Next Steps:**
1. Review the proposal at your convenience
2. Share with any stakeholders who need to weigh in
3. Let me know your questions — happy to schedule a follow-up call

I've helped similar companies achieve [RESULT] and I'm confident we can do the same for you.

Looking forward to your thoughts!

Best,
[Your Name]
[Phone]
[Email]`,
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    navigate("/preview");
  };

  if (isGenerating) {
    return <GeneratingLoader steps={generatingSteps} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/">
            <Logo />
          </Link>
          <ProgressStepper steps={steps} />
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Step 1: Client Context */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                  Step 1 of 3
                </span>
                <h1 className="text-3xl font-bold mb-2">Client Context</h1>
                <p className="text-muted-foreground">
                  Describe your client, their business, challenges, and what they are looking for...
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <Textarea
                  value={clientContext}
                  onChange={(e) => setClientContext(e.target.value)}
                  placeholder={`Example:

Had a call with Sarah from BrightTools (marketing SaaS).
They're at $75K MRR but growth has stalled.
Main issue: Customer acquisition is expensive.
They tried agencies but got burned by overpromising.
Want to hit $200K MRR by Q3.
Budget: Mentioned $15K-40K range.`}
                  className="min-h-[250px] resize-none bg-background border-border text-base"
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  Include their problem, goals, and any budget signals mentioned
                </p>
              </div>

              {/* Tips Card */}
              <div className="mt-6 rounded-xl border border-border bg-card/50 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Tips for better results</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Include company size and industry
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Mention specific challenges they shared
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Add any budget or timeline hints
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleNext}
                disabled={!canProceedStep1}
                variant="hero"
                size="lg"
                className="w-full mt-8"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Your Details */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                  Step 2 of 3
                </span>
                <h1 className="text-3xl font-bold mb-2">Your Details</h1>
                <p className="text-muted-foreground">
                  Customize your background and select relevant case studies
                </p>
              </div>

              {/* Background */}
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  Your Background & Credentials
                </Label>
                <Textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="min-h-[120px] resize-none bg-background border-border"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Edit to match your experience
                </p>
              </div>

              {/* Case Studies */}
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <Label className="text-base font-semibold mb-4 block">
                  Select Relevant Case Studies
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (Select 1-3)
                  </span>
                </Label>
                <div className="space-y-3">
                  {caseStudies.map((study) => (
                    <CaseStudyCard
                      key={study.id}
                      title={study.title}
                      description={study.description}
                      selected={selectedCaseStudies.includes(study.id)}
                      onToggle={() => toggleCaseStudy(study.id)}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Don't have case studies?{" "}
                  <Link to="#" className="text-primary hover:underline">
                    Get our library of 50 proven examples →
                  </Link>
                </p>
              </div>

              {/* Proposal Length */}
              <div className="rounded-xl border border-border bg-card p-6">
                <Label className="text-base font-semibold mb-4 block">
                  Proposal Length
                </Label>
                <RadioGroup
                  value={proposalLength}
                  onValueChange={setProposalLength}
                  className="space-y-3"
                >
                  {proposalLengths.map((length) => (
                    <label
                      key={length.value}
                      className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all ${
                        proposalLength === length.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <RadioGroupItem value={length.value} />
                      <div className="flex-1">
                        <div className="font-medium">{length.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {length.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex gap-4 mt-8">
                <Button onClick={handleBack} variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceedStep2}
                  variant="hero"
                  size="lg"
                  className="flex-1"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Generate */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                  Step 3 of 3
                </span>
                <h1 className="text-3xl font-bold mb-2">Set Your Pricing</h1>
                <p className="text-muted-foreground">
                  Define your pricing tiers for the proposal
                </p>
              </div>

              {/* Pricing Inputs */}
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strategy" className="mb-2 block">
                      Strategy & Training
                    </Label>
                    <Input
                      id="strategy"
                      value={pricingStrategy}
                      onChange={(e) => setPricingStrategy(e.target.value)}
                      placeholder="$7K-10K"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ai" className="mb-2 block">
                      Strategy + AI Systems
                    </Label>
                    <Input
                      id="ai"
                      value={pricingAI}
                      onChange={(e) => setPricingAI(e.target.value)}
                      placeholder="$15K-20K"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="managed" className="mb-2 block">
                      Fully Managed (monthly)
                    </Label>
                    <Input
                      id="managed"
                      value={pricingManaged}
                      onChange={(e) => setPricingManaged(e.target.value)}
                      placeholder="$5K-8K/month"
                      className="bg-background"
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Not sure what to charge?{" "}
                  <Link to="#" className="text-primary hover:underline">
                    Get our pricing masterclass →
                  </Link>
                </p>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-border bg-card p-6 mb-8">
                <h3 className="font-semibold mb-4">Review Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Context</span>
                    <span className="text-right max-w-[200px] truncate">
                      {clientContext.slice(0, 50)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Case Studies</span>
                    <span>{selectedCaseStudies.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Length</span>
                    <span className="capitalize">{proposalLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pricing Range</span>
                    <span>{pricingStrategy} – {pricingAI}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleBack} variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  variant="hero"
                  size="lg"
                  className="flex-1"
                >
                  Generate Complete Package
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer link */}
      <div className="fixed bottom-6 left-0 right-0 text-center">
        <Link
          to="#"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Don't have case studies? Get our library →
        </Link>
      </div>
    </div>
  );
}
