import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ProgressStepper } from "@/components/ProgressStepper";

import { LoadingScreen } from "@/components/LoadingScreen";
import { GeneratePageVideo } from "@/components/GeneratePageVideo";
import { EmailSignupModal } from "@/components/EmailSignupModal";
import { PaywallModal } from "@/components/PaywallModal";
import { BusinessTypeSelector, businessTypes } from "@/components/BusinessTypeSelector";
import { PricingTierInput } from "@/components/PricingTierInput";
import { FileUploadButton } from "@/components/FileUploadButton";
import {
  useProposalStore,
  proposalLengths,
} from "@/lib/proposalStore";
import { useStreamingProposal } from "@/hooks/useStreamingProposal";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { ArrowLeft, ArrowRight, Lightbulb, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { analytics } from "@/lib/analytics";

export default function Generate() {
  const navigate = useNavigate();
  const { user, quickSignUp } = useAuth();
  const { 
    subscribed, 
    has_lifetime,
    proposals_this_month, 
    proposals_limit,
    checkIpUsage,
    recordUsage,
    checkSubscription,
  } = useSubscription();
  const [currentStep, setCurrentStep] = useState(1);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
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
    proposalLength,
    setProposalLength,
    businessType,
    setBusinessType,
    customBusinessType,
    setCustomBusinessType,
    pricingTiers,
    setPricingTiers,
    setDeliverables,
    saveToDatabase,
  } = useProposalStore();

  const steps = [
    { label: "Your Business", completed: currentStep > 1, active: currentStep === 1 },
    { label: "Client Info", completed: currentStep > 2, active: currentStep === 2 },
    { label: "Generate", completed: false, active: currentStep === 3 },
  ];

  // Check if coming from lead with pre-filled context
  useEffect(() => {
    if (clientContext.trim().length > 20 && clientName.trim().length > 0) {
      // Skip to step 2 if context is pre-filled from a lead
      setCurrentStep(2);
    }
  }, []); // Only run on mount

  // Step 1: Business type selected
  const canProceedStep1 = businessType.length > 0 && 
    (businessType !== 'other' || customBusinessType.trim().length > 0) &&
    background.trim().length > 0;
  
  // Step 2: Client context provided
  const canProceedStep2 = clientContext.trim().length > 20;

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

  const handleGenerateClick = async () => {
    // If not logged in, show email modal first
    if (!user) {
      // Check IP-based usage for free tier
      const ipUsage = await checkIpUsage();
      if (!ipUsage.can_generate) {
        analytics.paywallShown('ip_limit_reached');
        setShowPaywall(true);
        return;
      }
      setShowEmailModal(true);
      return;
    }

    // For logged-in users, check their subscription limits
    if (!has_lifetime) {
      if (subscribed) {
        // Pro user - check monthly limit
        if (proposals_this_month >= proposals_limit) {
          analytics.paywallShown('monthly_limit_reached');
          setShowPaywall(true);
          return;
        }
      } else {
        // Free user - check IP-based limit
        const ipUsage = await checkIpUsage();
        if (!ipUsage.can_generate) {
          analytics.paywallShown('free_limit_reached');
          setShowPaywall(true);
          return;
        }
      }
    }

    startGeneration();
  };

  const handleEmailSignup = async (email: string) => {
    // Check IP limit before signup
    const ipUsage = await checkIpUsage();
    if (!ipUsage.can_generate) {
      setShowPaywall(true);
      return { error: new Error('Free limit reached') };
    }

    const result = await quickSignUp(email);
    if (!result.error) {
      startGeneration();
    }
    return result;
  };

  const getBusinessTypeLabel = () => {
    if (businessType === 'other') return customBusinessType;
    return businessTypes.find(t => t.value === businessType)?.label || businessType;
  };

  const getPricingString = () => {
    const validTiers = pricingTiers.filter(t => t.name && t.price);
    if (validTiers.length === 0) return 'Not specified';
    return validTiers.map(t => `${t.name}: ${t.price}`).join(' | ');
  };

  const startGeneration = () => {
    // Track proposal generation started
    analytics.proposalStarted(getBusinessTypeLabel(), background.trim().length > 0);

    setGeneratingSteps([
      { label: "Analyzing client context", status: "active" },
      { label: "Creating proposal structure", status: "pending" },
      { label: "Writing proposal content", status: "pending" },
    ]);

    // Convert pricing tiers to the format expected by the API
    const pricingFromTiers = pricingTiers.reduce((acc, tier, idx) => {
      if (tier.name && tier.price) {
        if (idx === 0) acc.strategy = `${tier.name}: ${tier.price}`;
        else if (idx === 1) acc.ai = `${tier.name}: ${tier.price}`;
        else if (idx === 2) acc.managed = `${tier.name}: ${tier.price}`;
      }
      return acc;
    }, { strategy: '', ai: '', managed: '' });

    const hasPricing = pricingTiers.some(t => t.name && t.price);

    startStreaming({
      clientContext,
      background: `Business Type: ${getBusinessTypeLabel()}\n\n${background}`,
      length: proposalLength,
      pricing: pricingFromTiers,
      onProgress: (progressVal) => {
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

        // Track successful generation
        analytics.proposalGenerated(proposalLength, hasPricing);

        setDeliverables({
          proposal: content,
          deckPrompt: '',
          contract: '',
          contractEmail: '',
          invoiceDescription: '',
          proposalEmail: '',
        });

        // Record usage and save to database
        await recordUsage();
        await saveToDatabase();
        
        // Refresh subscription status to update proposal count
        await checkSubscription();
        
        await new Promise((resolve) => setTimeout(resolve, 300));
        navigate("/dashboard", { state: { fromGenerate: true } });
      },
      onError: (error) => {
        // Track failed generation
        analytics.proposalFailed(error || 'Unknown error');
        
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
      <LoadingScreen 
        context="proposal"
        steps={generatingSteps} 
        progress={progress}
        charCount={charCount}
        showMetrics={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-3 md:px-4">
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>
          <div className="flex-1 flex justify-center px-2">
            <ProgressStepper steps={steps} />
          </div>
          <div className="w-12 md:w-32 flex-shrink-0" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 md:px-4 py-6 md:py-12">
        <div className="grid lg:grid-cols-[1fr,320px] gap-6 md:gap-8 max-w-5xl mx-auto">
          <div className="max-w-3xl">
          {/* Step 1: Your Business */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                  Step 1 of 3
                </span>
                <h1 className="text-3xl font-bold mb-2">Your Business</h1>
                <p className="text-muted-foreground">
                  Tell us about your consulting practice
                </p>
              </div>

              {/* Business Type */}
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <Label className="text-base font-semibold mb-4 block">
                  What type of consulting do you do?
                </Label>
                <BusinessTypeSelector
                  value={businessType}
                  customValue={customBusinessType}
                  onChange={setBusinessType}
                  onCustomChange={setCustomBusinessType}
                />
              </div>

              {/* Background */}
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">
                    Your Background & Credentials
                  </Label>
                  <FileUploadButton
                    onTextExtracted={(text) => {
                      setBackground(background ? `${background}\n\n${text}` : text);
                    }}
                  />
                </div>
                <Textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="Paste your LinkedIn summary, resume highlights, or key credentials..."
                  className="min-h-[120px] resize-none bg-background border-border"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Copy/paste from your LinkedIn or website, or upload a resume/bio
                </p>
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

          {/* Step 2: Client Info */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                  Step 2 of 3
                </span>
                <h1 className="text-3xl font-bold mb-2">Client Info</h1>
                <p className="text-muted-foreground">
                  Tell us about this specific client and project
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

              {/* Client Context */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">
                    Project Context
                  </Label>
                  <FileUploadButton
                    onTextExtracted={(text) => {
                      setClientContext(clientContext ? `${clientContext}\n\n${text}` : text);
                    }}
                  />
                </div>
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
                  Include their problem, goals, and any budget signals — or upload an RFP/brief
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
                <h1 className="text-3xl font-bold mb-2">Pricing & Generate</h1>
                <p className="text-muted-foreground">
                  Set your pricing tiers and proposal options
                </p>
              </div>

              {/* Pricing Tiers */}
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
                <Label className="text-base font-semibold mb-4 block">
                  Pricing Tiers
                </Label>
                <PricingTierInput
                  tiers={pricingTiers}
                  onChange={setPricingTiers}
                  maxTiers={3}
                />
              </div>

              {/* Proposal Length */}
              <div className="rounded-xl border border-border bg-card p-6 mb-6">
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

              {/* Summary */}
              <div className="rounded-xl border border-border bg-card p-6 mb-8">
                <h3 className="font-semibold mb-4">Review Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business Type</span>
                    <span>{getBusinessTypeLabel() || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client</span>
                    <span>{clientName || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Length</span>
                    <span className="capitalize">{proposalLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pricing</span>
                    <span className="text-right max-w-[200px] truncate">
                      {getPricingString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleBack} variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={handleGenerateClick}
                  variant="hero"
                  size="lg"
                  className="flex-1"
                >
                  Generate Proposal
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
          </div>
          
          {/* Sidebar with Video - Hidden on mobile */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <GeneratePageVideo step={currentStep} />
            </div>
          </div>
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

      {/* Email Signup Modal */}
      <EmailSignupModal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
        onSubmit={handleEmailSignup}
      />

      {/* Paywall Modal */}
      <PaywallModal
        open={showPaywall}
        onOpenChange={setShowPaywall}
        proposalsUsed={proposals_this_month}
        proposalsLimit={proposals_limit}
      />
    </div>
  );
}
