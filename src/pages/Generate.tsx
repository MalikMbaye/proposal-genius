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
import { useStreamingProposal } from "@/hooks/useStreamingProposal";
import { ArrowLeft, ArrowRight, Lightbulb, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Generate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [generatingSteps, setGeneratingSteps] = useState<
    { label: string; status: "pending" | "active" | "completed" }[]
  >([
    { label: "Analyzing client context", status: "pending" },
    { label: "Creating proposal structure", status: "pending" },
    { label: "Writing proposal content", status: "pending" },
  ]);
  
  const { 
    isStreaming, 
    content: streamingContent, 
    charCount, 
    progress, 
    startStreaming 
  } = useStreamingProposal();

  const {
    clientName,
    setClientName,
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
    saveToDatabase,
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
    // Reset steps for proposal-only generation
    setGeneratingSteps([
      { label: "Analyzing client context", status: "active" },
      { label: "Creating proposal structure", status: "pending" },
      { label: "Writing proposal content", status: "pending" },
    ]);

    // Get selected case study descriptions
    const selectedStudyDescriptions = caseStudies
      .filter((cs) => selectedCaseStudies.includes(cs.id))
      .map((cs) => `${cs.title}: ${cs.description}`)
      .join("\n");

    startStreaming({
      clientContext,
      background,
      caseStudies: selectedStudyDescriptions,
      length: proposalLength,
      pricing: {
        strategy: pricingStrategy,
        ai: pricingAI,
        managed: pricingManaged,
      },
      onProgress: (progressVal) => {
        // Update steps based on progress
        if (progressVal < 20) {
          setGeneratingSteps([
            { label: "Analyzing client context", status: "active" },
            { label: "Creating proposal structure", status: "pending" },
            { label: "Writing proposal content", status: "pending" },
          ]);
        } else if (progressVal < 50) {
          setGeneratingSteps([
            { label: "Analyzing client context", status: "completed" },
            { label: "Creating proposal structure", status: "active" },
            { label: "Writing proposal content", status: "pending" },
          ]);
        } else {
          setGeneratingSteps([
            { label: "Analyzing client context", status: "completed" },
            { label: "Creating proposal structure", status: "completed" },
            { label: "Writing proposal content", status: "active" },
          ]);
        }
      },
      onComplete: async (content) => {
        setGeneratingSteps([
          { label: "Analyzing client context", status: "completed" },
          { label: "Creating proposal structure", status: "completed" },
          { label: "Writing proposal content", status: "completed" },
        ]);

        // Set the proposal
        setDeliverables({
          proposal: content,
          deckPrompt: '',
          contract: '',
          contractEmail: '',
          invoiceDescription: '',
          proposalEmail: '',
        });

        // Save to database
        await saveToDatabase();
        
        await new Promise((resolve) => setTimeout(resolve, 300));
        navigate("/preview");
      },
      onError: (error) => {
        toast({
          title: "Generation failed",
          description: error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  if (isStreaming) {
    return (
      <GeneratingLoader 
        steps={generatingSteps} 
        progress={progress}
        charCount={charCount}
        streamingContent={streamingContent}
        showPreview={true}
      />
    );
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

              {/* Client Name */}
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <Label htmlFor="clientName" className="text-base font-semibold mb-3 block">
                  Client Name
                </Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g., Sarah from BrightTools"
                  className="bg-background"
                />
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <Label className="text-base font-semibold mb-3 block">
                  Project Context
                </Label>
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
                  className="min-h-[200px] resize-none bg-background border-border text-base"
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
                  <Sparkles className="ml-2 h-5 w-5" />
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
