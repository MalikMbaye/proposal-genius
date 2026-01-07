import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { ProposalSelector } from "@/components/ProposalSelector";
import { useProposalStore, caseStudies } from "@/lib/proposalStore";
import { supabase } from "@/integrations/supabase/client";
import { PDFViewer } from "@/components/PDFViewer";
import { DeckGeneratingLoader } from "@/components/DeckGeneratingLoader";
import { DeckRevealConfetti } from "@/components/DeckRevealConfetti";
import { OnboardingTab } from "@/components/OnboardingTab";
import { ProposalLibraryTab } from "@/components/ProposalLibraryTab";
import { StyledProposalPreview } from "@/components/StyledProposalPreview";
import { LoadingScreen, LoadingStep } from "@/components/LoadingScreen";
import jsPDF from "jspdf";
import {
  FileText,
  Presentation,
  FileCheck,
  Mail,
  Receipt,
  Send,
  Copy,
  Download,
  ExternalLink,
  Check,
  X,
  Plus,
  Sparkles,
  Loader2,
  Sun,
  Moon,
  Library,
  FileDown,
  User,
  Users,
  Phone,
  MessageSquare,
  Home,
  Pencil,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { EditProposalModal } from "@/components/EditProposalModal";
import { useStreamingProposal } from "@/hooks/useStreamingProposal";
import { useDeckGenerationJob, DeckJob } from "@/hooks/useDeckGenerationJob";
import { businessTypes } from "@/components/BusinessTypeSelector";
import { toast } from "@/hooks/use-toast";
import { generatePptxFromPrompt } from "@/lib/generatePptx";

// Asset generation loading steps by type
const assetLoadingSteps: Record<string, { label: string }[]> = {
  contract: [
    { label: "Analyzing proposal terms" },
    { label: "Structuring legal clauses" },
    { label: "Generating contract" },
  ],
  contractEmail: [
    { label: "Extracting key points" },
    { label: "Crafting email copy" },
    { label: "Finalizing message" },
  ],
  invoiceDescription: [
    { label: "Parsing deliverables" },
    { label: "Formatting line items" },
    { label: "Creating invoice" },
  ],
  proposalEmail: [
    { label: "Summarizing proposal" },
    { label: "Writing email body" },
    { label: "Adding call-to-action" },
  ],
};

// Map asset types to loading contexts
const assetToContext: Record<string, "contract" | "invoice" | "proposal" | "email"> = {
  contract: "contract",
  contractEmail: "email",
  invoiceDescription: "invoice",
  proposalEmail: "email",
};

// Consolidated tabs - removed deckPrompt, merged into deck
const tabs = [
  { id: "home", label: "Getting Started", icon: Home },
  { id: "proposal", label: "Proposal", icon: FileText },
  { id: "deck", label: "Slide Deck", icon: Presentation },
  { id: "contract", label: "Contract", icon: FileCheck },
  { id: "contractEmail", label: "Contract Email", icon: Send },
  { id: "invoiceDescription", label: "Invoice", icon: Receipt },
  { id: "proposalEmail", label: "Proposal Email", icon: Mail },
  { id: "library", label: "Proposal Library", icon: Library },
] as const;

type TabId = (typeof tabs)[number]["id"];

const tabInstructions: Record<TabId, string> = {
  home: "Everything you need to know to create winning proposals.",
  library: "Access 50+ real proposals that closed real deals.",
  proposal: "Copy and paste into Google Docs or Word. Review, save as PDF, send.",
  deck: "Preview your AI-generated slide deck. Download the PDF when ready.",
  contract: "Paste into Square Contracts. Fill in [BRACKETED] fields. Send for signature.",
  contractEmail: "Copy and paste into your email client. Customize the [BRACKETED] fields.",
  invoiceDescription: "Copy and paste into your invoice or accounting system.",
  proposalEmail: "Copy and paste into your email client. Customize and send.",
};

const tabLabels: Record<TabId, string> = {
  home: "Getting Started",
  library: "Proposal Library",
  proposal: "Proposal",
  deck: "Slide Deck",
  contract: "Contract",
  contractEmail: "Contract Email",
  invoiceDescription: "Invoice Description",
  proposalEmail: "Proposal Email",
};

export default function Preview() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Default to "home" unless we came from generate (have a proposal)
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [showBanner, setShowBanner] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatingAsset, setGeneratingAsset] = useState<TabId | null>(null);
  const [assetGenerationSteps, setAssetGenerationSteps] = useState<LoadingStep[]>([]);
  const [assetGenerationProgress, setAssetGenerationProgress] = useState(0);
  const assetProgressInterval = useRef<NodeJS.Timeout | null>(null);
  const [lightMode, setLightMode] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDeckConfetti, setShowDeckConfetti] = useState(false);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);
  const previousDeckStatus = useRef<string | null>(null);
  
  const { 
    proposalId,
    deliverables, 
    updateDeliverable,
    setDeliverables,
    reset,
    clientContext,
    clientName,
    background,
    businessType,
    customBusinessType,
    pricingTiers,
    selectedCaseStudies,
    pricingStrategy,
    pricingAI,
    pricingManaged,
    deckData,
    setDeckData,
    saveToDatabase,
  } = useProposalStore();
  
  const { 
    isStreaming, 
    progress, 
    charCount, 
    startStreaming 
  } = useStreamingProposal();

  // Persistent deck generation job hook
  const handleDeckComplete = useCallback((job: DeckJob) => {
    setDeckData({
      status: 'completed',
      generationId: job.id,
      externalUrl: null,
      pdfUrl: job.result_url,
      pptxUrl: null,
      thumbnailUrl: null,
    });
    saveToDatabase();
    
    // Trigger confetti celebration!
    if (!hasShownConfetti) {
      setShowDeckConfetti(true);
      setHasShownConfetti(true);
    }
    
    toast({
      title: "🎉 Slide deck generated!",
      description: "Your presentation is ready to preview and download.",
    });
  }, [setDeckData, saveToDatabase, hasShownConfetti]);

  const handleDeckError = useCallback((error: string) => {
    setDeckData({
      status: 'error',
      error,
    });
  }, [setDeckData]);

  const {
    currentJob: deckJob,
    isGenerating: isDeckGenerating,
    startGeneration: startDeckGeneration,
  } = useDeckGenerationJob({
    proposalId,
    onComplete: handleDeckComplete,
    onError: handleDeckError,
  });

  // Sync deck job status to deckData for UI
  useEffect(() => {
    if (deckJob) {
      if (deckJob.status === 'pending' || deckJob.status === 'running') {
        if (deckData.status !== 'generating') {
          setDeckData({ status: 'generating', error: null });
        }
      } else if (deckJob.status === 'completed' && deckJob.result_url) {
        setDeckData({
          status: 'completed',
          generationId: deckJob.id,
          externalUrl: null,
          pdfUrl: deckJob.result_url,
          pptxUrl: null,
          thumbnailUrl: null,
        });
      } else if (deckJob.status === 'failed') {
        setDeckData({
          status: 'error',
          error: deckJob.error_message || 'Generation failed',
        });
      }
    }
  }, [deckJob, deckData.status, setDeckData]);

  // Trigger confetti when deck status changes from generating to completed
  useEffect(() => {
    if (previousDeckStatus.current === 'generating' && deckData.status === 'completed' && !hasShownConfetti) {
      setShowDeckConfetti(true);
      setHasShownConfetti(true);
    }
    previousDeckStatus.current = deckData.status;
  }, [deckData.status, hasShownConfetti]);

  // Reset confetti state when starting a new deck generation
  useEffect(() => {
    if (deckData.status === 'generating') {
      setHasShownConfetti(false);
    }
  }, [deckData.status]);

  // If we have a proposal, show banner and switch to proposal tab on initial load
  useEffect(() => {
    if (deliverables?.proposal && activeTab === "home") {
      // Only auto-switch to proposal if we just generated one (coming from /generate)
      if (location.state?.fromGenerate) {
        setActiveTab("proposal");
        setShowBanner(true);
      }
    }
  }, [deliverables?.proposal, location.state]);

  const hasProposal = deliverables?.proposal;
  const isHomeTab = activeTab === 'home';
  const isLibraryTab = activeTab === 'library';
  const isDeckTab = activeTab === 'deck';
  const currentContent = isDeckTab || isHomeTab || isLibraryTab ? '' : (deliverables?.[activeTab as keyof typeof deliverables] || '');
  const hasContent = isDeckTab ? deckData.status === 'completed' : isHomeTab || isLibraryTab ? false : currentContent.length > 0;
  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon || FileText;

  const getBusinessTypeLabel = () => {
    if (businessType === 'other') return customBusinessType;
    return businessTypes.find(t => t.value === businessType)?.label || businessType;
  };

  const handleRegenerateProposal = () => {
    setShowEditModal(false);
    
    // Convert pricing tiers to the format expected by the API
    const pricingFromTiers = pricingTiers.reduce((acc, tier, idx) => {
      if (tier.name && tier.price) {
        if (idx === 0) acc.strategy = `${tier.name}: ${tier.price}`;
        else if (idx === 1) acc.ai = `${tier.name}: ${tier.price}`;
        else if (idx === 2) acc.managed = `${tier.name}: ${tier.price}`;
      }
      return acc;
    }, { strategy: '', ai: '', managed: '' });

    startStreaming({
      clientContext,
      background: `Business Type: ${getBusinessTypeLabel()}\n\n${background}`,
      length: useProposalStore.getState().proposalLength,
      pricing: pricingFromTiers,
      onComplete: async (content) => {
        setDeliverables({
          proposal: content,
          deckPrompt: '',
          contract: '',
          contractEmail: '',
          invoiceDescription: '',
          proposalEmail: '',
        });
        await saveToDatabase();
        toast({
          title: "Proposal regenerated",
          description: "Your updated proposal is ready.",
        });
      },
      onError: (error) => {
        toast({
          title: "Regeneration failed",
          description: error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleGenerateAsset = async (assetType: TabId) => {
    if (assetType === 'proposal') return;
    if (assetType === 'deck') return;
    
    // Initialize loading state with steps
    const steps = assetLoadingSteps[assetType] || [{ label: "Generating content" }];
    setAssetGenerationSteps(steps.map((s, i) => ({
      label: s.label,
      status: i === 0 ? 'active' : 'pending' as const,
    })));
    setAssetGenerationProgress(0);
    setGeneratingAsset(assetType);
    
    // Simulate progress with step transitions
    let currentStep = 0;
    const progressPerStep = 100 / steps.length;
    
    assetProgressInterval.current = setInterval(() => {
      setAssetGenerationProgress(prev => {
        const newProgress = Math.min(prev + 2, 95);
        
        // Update step status based on progress
        const newStepIndex = Math.floor(newProgress / progressPerStep);
        if (newStepIndex > currentStep && newStepIndex < steps.length) {
          currentStep = newStepIndex;
          setAssetGenerationSteps(prev => prev.map((s, i) => ({
            ...s,
            status: i < newStepIndex ? 'completed' : i === newStepIndex ? 'active' : 'pending',
          })));
        }
        
        return newProgress;
      });
    }, 150);
    
    try {
      const selectedStudyDescriptions = caseStudies
        .filter((cs) => selectedCaseStudies.includes(cs.id))
        .map((cs) => `${cs.title}: ${cs.description}`)
        .join("\n");

      const { data, error } = await supabase.functions.invoke('generate-asset', {
        body: {
          assetType,
          clientContext,
          background,
          caseStudies: selectedStudyDescriptions,
          pricing: {
            strategy: pricingStrategy,
            ai: pricingAI,
            managed: pricingManaged,
          },
          proposalContent: deliverables?.proposal || '',
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Complete the progress
      if (assetProgressInterval.current) {
        clearInterval(assetProgressInterval.current);
      }
      setAssetGenerationProgress(100);
      setAssetGenerationSteps(prev => prev.map(s => ({ ...s, status: 'completed' as const })));

      updateDeliverable(assetType as keyof typeof deliverables, data.content);
      
      // Brief delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: `${tabLabels[assetType]} generated`,
        description: "Your asset is ready to use.",
      });
    } catch (error) {
      console.error("Asset generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      if (assetProgressInterval.current) {
        clearInterval(assetProgressInterval.current);
      }
      setGeneratingAsset(null);
      setAssetGenerationProgress(0);
      setAssetGenerationSteps([]);
    }
  };

  // Create a deck prompt from the proposal if no deckPrompt exists
  const createDeckPromptFromProposal = () => {
    if (!deliverables?.proposal) return null;
    
    return `Create a professional presentation based on this proposal content:

${deliverables.proposal.substring(0, 3000)}

Key requirements:
- Make it visually compelling with modern design
- Include clear sections: Problem, Solution, Approach, Timeline, Investment
- Use data visualizations where appropriate
- Keep text minimal, focus on visual impact`;
  };

  const handleGenerateDeck = async () => {
    // Use the deck prompt if available, otherwise use proposal content as the prompt
    const promptToUse = deliverables?.deckPrompt || createDeckPromptFromProposal();
    
    if (!promptToUse) {
      toast({
        title: "Unable to generate deck",
        description: "Please ensure you have a proposal generated first.",
        variant: "destructive",
      });
      return;
    }

    // Use the persistent job system
    await startDeckGeneration({
      deckPrompt: promptToUse,
      clientName: clientName || 'Client',
      numSlides: 10,
      proposalId: proposalId || undefined,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try selecting and copying manually.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: `${activeTab}.txt has been downloaded.`,
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const lines = currentContent.split("\n");

    const addNewPageIfNeeded = (requiredSpace: number) => {
      if (y + requiredSpace > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const stripMarkdown = (text: string): string => {
      return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1');
    };

    lines.forEach((line) => {
      if (line.trim() === "") {
        y += 4;
        return;
      }

      if (line.trim() === "---" || line.trim() === "***") {
        addNewPageIfNeeded(8);
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 8;
        return;
      }

      if (line.startsWith("# ")) {
        addNewPageIfNeeded(14);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(30, 30, 30);
        const text = stripMarkdown(line.slice(2));
        const splitText = doc.splitTextToSize(text, maxWidth);
        doc.text(splitText, margin, y);
        y += splitText.length * 8 + 6;
        return;
      }

      if (line.startsWith("## ")) {
        addNewPageIfNeeded(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        const text = stripMarkdown(line.slice(3));
        const splitText = doc.splitTextToSize(text, maxWidth);
        doc.text(splitText, margin, y);
        y += splitText.length * 6 + 4;
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y - 2, pageWidth - margin, y - 2);
        y += 4;
        return;
      }

      if (line.startsWith("### ")) {
        addNewPageIfNeeded(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        const text = stripMarkdown(line.slice(4));
        const splitText = doc.splitTextToSize(text, maxWidth);
        doc.text(splitText, margin, y);
        y += splitText.length * 5 + 4;
        return;
      }

      if (line.startsWith("- ") || line.startsWith("• ")) {
        addNewPageIfNeeded(8);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const bulletX = margin + 2;
        doc.text("•", bulletX, y);
        const text = stripMarkdown(line.slice(2));
        const splitText = doc.splitTextToSize(text, maxWidth - 8);
        doc.text(splitText, margin + 6, y);
        y += splitText.length * 4 + 2;
        return;
      }

      if (/^\d+\.\s/.test(line)) {
        addNewPageIfNeeded(8);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          doc.text(`${match[1]}.`, margin + 2, y);
          const text = stripMarkdown(match[2]);
          const splitText = doc.splitTextToSize(text, maxWidth - 10);
          doc.text(splitText, margin + 10, y);
          y += splitText.length * 4 + 2;
        }
        return;
      }

      if (line.startsWith("✓ ") || line.startsWith("✗ ")) {
        addNewPageIfNeeded(8);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        if (line.startsWith("✓")) {
          doc.setTextColor(34, 139, 34);
        } else {
          doc.setTextColor(220, 20, 60);
        }
        doc.text(line.charAt(0), margin + 2, y);
        doc.setTextColor(80, 80, 80);
        const text = stripMarkdown(line.slice(2));
        const splitText = doc.splitTextToSize(text, maxWidth - 8);
        doc.text(splitText, margin + 8, y);
        y += splitText.length * 4 + 2;
        return;
      }

      if (line.startsWith("> ")) {
        addNewPageIfNeeded(8);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.5);
        doc.line(margin + 2, y - 3, margin + 2, y + 4);
        const text = stripMarkdown(line.slice(2));
        const splitText = doc.splitTextToSize(text, maxWidth - 10);
        doc.text(splitText, margin + 6, y);
        y += splitText.length * 4 + 4;
        return;
      }

      addNewPageIfNeeded(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const text = stripMarkdown(line);
      const splitText = doc.splitTextToSize(text, maxWidth);
      doc.text(splitText, margin, y);
      y += splitText.length * 4 + 3;
    });

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    doc.save(`${tabLabels[activeTab].replace(/\s+/g, '-').toLowerCase()}.pdf`);
    
    toast({
      title: "PDF exported",
      description: `${tabLabels[activeTab]}.pdf has been downloaded.`,
    });
  };

  const handleDownloadPptx = async () => {
    const promptToUse = deliverables?.deckPrompt;
    
    if (!promptToUse) {
      toast({
        title: "No deck content",
        description: "Generate a proposal first to create an editable PPTX.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const blob = await generatePptxFromPrompt(
        promptToUse,
        clientName || 'Client'
      );
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${clientName || 'proposal'}-deck.pptx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "PPTX Downloaded",
        description: "Open in PowerPoint or Google Slides to edit.",
      });
    } catch (error) {
      console.error('PPTX generation error:', error);
      toast({
        title: "Download failed",
        description: "Could not generate PPTX file.",
        variant: "destructive",
      });
    }
  };

  const handleNewProposal = () => {
    reset();
    navigate("/generate");
  };

  // Show full loading screen when generating any asset (except deck which has its own loader)
  if (generatingAsset && generatingAsset !== 'deck') {
    return (
      <LoadingScreen
        context={assetToContext[generatingAsset] || 'proposal'}
        steps={assetGenerationSteps}
        progress={assetGenerationProgress}
        showMetrics={true}
        showTerminal={true}
      />
    );
  }

  // Sidebar content component for reuse in desktop and mobile
  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {/* Tabs - scrollable if many */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Getting Started - Always first */}
        <button
          onClick={() => {
            setActiveTab('home');
            onNavigate?.();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'home'
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-700"
          }`}
        >
          <Home className="h-4 w-4" />
          <span className="flex-1 text-left">Getting Started</span>
        </button>
        
        {/* Edit Project Brief - Between Getting Started and Proposal */}
        {hasProposal && (
          <button
            onClick={() => {
              setShowEditModal(true);
              onNavigate?.();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400/50 hover:bg-amber-500/10"
          >
            <Pencil className="h-4 w-4" />
            <span className="flex-1 text-left">Edit Project Brief</span>
          </button>
        )}
        
        {/* Your Pitch Kit Section */}
        <div className="mt-4 mb-2">
          <div className="border-t border-slate-700 mx-1" />
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mt-3 mb-2">
            Your Pitch Kit
          </p>
        </div>
        
        {/* Rest of tabs - skip home since it's rendered above */}
        {tabs.filter(tab => tab.id !== 'library' && tab.id !== 'home').map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isGenerating = generatingAsset === tab.id || (tab.id === 'deck' && deckData.status === 'generating');
          
          let hasTabContent = false;
          if (tab.id === 'deck') {
            hasTabContent = deckData.status === 'completed';
          } else if (tab.id === 'proposal') {
            hasTabContent = !!deliverables?.proposal;
          } else {
            hasTabContent = (deliverables?.[tab.id as keyof typeof deliverables] || '').length > 0;
          }
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                onNavigate?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-700"
              }`}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <span className="flex-1 text-left">{tab.label}</span>
              {!hasTabContent && (
                <span className="text-xs opacity-60">•</span>
              )}
              {hasTabContent && tab.id !== 'proposal' && (
                <Check className="h-3 w-3 opacity-60" />
              )}
            </button>
          );
        })}
        
        {/* Leads Section */}
        <div className="mt-4 mb-2">
          <div className="border-t border-slate-700 mx-1" />
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mt-3 mb-2">
            Leads
          </p>
        </div>
        <Link
          to="/leads"
          onClick={onNavigate}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-700"
        >
          <Users className="h-4 w-4" />
          <span className="flex-1 text-left">All Leads</span>
        </Link>
        <Link
          to="/leads"
          onClick={onNavigate}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-700"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="flex-1 text-left">DM Conversations</span>
        </Link>
        <Link
          to="/call-script"
          onClick={onNavigate}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-700"
        >
          <Phone className="h-4 w-4" />
          <span className="flex-1 text-left">Call Scripts</span>
        </Link>
      </nav>
      
      {/* Proposal Library - Separated at bottom */}
      <div className="px-3 pb-2 border-t border-slate-700 pt-3">
        <button
          onClick={() => {
            setActiveTab('library');
            onNavigate?.();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'library'
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-emerald-400 hover:text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-500/10 animate-pulse-slow"
          }`}
        >
          <Library className="h-4 w-4" />
          <span className="flex-1 text-left">Proposal Library</span>
          {activeTab !== 'library' && (
            <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded">PRO</span>
          )}
        </button>
      </div>

      {/* Sidebar Actions */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        {hasContent && !isDeckTab && (
          <>
            <Button onClick={() => { handleCopy(); onNavigate?.(); }} variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Current
                </>
              )}
            </Button>
            <Button onClick={() => { handleDownload(); onNavigate?.(); }} variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </>
        )}
        <div className="border-t border-slate-700 pt-3 mt-2 space-y-1">
          <Button onClick={() => { handleNewProposal(); onNavigate?.(); }} variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700">
            <Plus className="mr-2 h-4 w-4" />
            Generate New
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700">
            <Link to="/profile" onClick={onNavigate}>
              <User className="mr-2 h-4 w-4" />
              Account Settings
            </Link>
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Deck reveal confetti celebration */}
      <DeckRevealConfetti 
        isActive={showDeckConfetti} 
        onComplete={() => setShowDeckConfetti(false)} 
      />
      
      <div className="h-screen bg-slate-800 flex flex-col overflow-hidden">
      {/* Mobile Header with Hamburger */}
      {isMobile ? (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-slate-800 border-slate-700">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-slate-700">
                  <span className="text-lg font-semibold text-white">Menu</span>
                </div>
                <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex-1 flex justify-center">
            <ProposalSelector />
          </div>
          
          <Button
            onClick={handleNewProposal}
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:text-white"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <AppHeader center={<ProposalSelector />} onNewProposal={handleNewProposal} />
      )}

      <div key={proposalId ?? "new"} className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-64 border-r border-slate-700 bg-slate-800 flex flex-col flex-shrink-0 overflow-hidden">
            <SidebarContent />
          </aside>
        )}

      {/* Main Content - Scrollable */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-700">
        {/* Success Banner */}
        {showBanner && (
          <div className="bg-success/10 border-b border-success/20 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success">
                <Check className="h-4 w-4 text-success-foreground" />
              </div>
              <span className="text-sm font-medium">
                Proposal ready! Generate additional assets as needed.
              </span>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Document Header - hide for home and library tabs */}
        {!isHomeTab && !isLibraryTab && (
          <div className="border-b border-slate-600 px-6 py-4 flex items-center justify-between bg-slate-800/50">
            <div className="flex items-center gap-3">
              <ActiveIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold text-slate-100">{tabLabels[activeTab]}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Deck tab actions */}
              {activeTab === "deck" && hasContent && (
                <>
                  {deckData.pdfUrl && (
                    <Button size="sm" asChild>
                      <a href={deckData.pdfUrl} target="_blank" rel="noopener noreferrer" download>
                        <FileDown className="mr-2 h-4 w-4" />
                        Download PDF
                      </a>
                    </Button>
                  )}
                  {deliverables?.deckPrompt && (
                    <Button size="sm" variant="outline" onClick={handleDownloadPptx} className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
                      <FileDown className="mr-2 h-4 w-4" />
                      PPTX (Editable)
                    </Button>
                  )}
                  {deckData.externalUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={deckData.externalUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Deck
                      </a>
                    </Button>
                  )}
                </>
              )}
              {/* Other tabs actions */}
              {hasContent && !isDeckTab && (
                <>
                  <Button 
                    onClick={() => setLightMode(!lightMode)} 
                    variant="outline" 
                    size="sm"
                    title={lightMode ? "Switch to dark mode" : "Switch to PDF preview"}
                    className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
                  >
                    {lightMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                    {lightMode ? "Dark" : "PDF View"}
                  </Button>
                  <Button onClick={handleCopy} variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    Copy
                  </Button>
                  <Button onClick={handleDownload} variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white">
                    <Download className="mr-2 h-4 w-4" />
                    TXT
                  </Button>
                  <Button onClick={handleExportPDF} size="sm">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Document Content */}
        <div className={`flex-1 overflow-auto ${isHomeTab || isLibraryTab ? '' : 'p-3 md:p-6'}`}>
          <div className={`mx-auto ${isHomeTab || isLibraryTab ? 'h-full' : isDeckTab ? 'max-w-6xl' : 'max-w-4xl'}`}>
            {/* Deck Tab - Special handling */}
            {isDeckTab && (
              <>
                {deckData.status === 'idle' && (
                  <div className="rounded-xl border border-slate-600 bg-slate-800 p-6 md:p-12 text-center">
                    <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 md:mb-6">
                      <Presentation className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold mb-2 text-slate-100">Generate Slide Deck</h2>
                    <p className="text-slate-400 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
                      Create a stunning presentation from your proposal using AI. 
                      This typically takes 5-7 minutes.
                    </p>
                    <Button 
                      onClick={handleGenerateDeck}
                      disabled={!deliverables?.proposal}
                      size="lg"
                      className="w-full md:w-auto"
                    >
                      <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      Generate Slide Deck
                    </Button>
                  </div>
                )}
                {deckData.status === 'generating' && (
                  <DeckGeneratingLoader clientName={clientName} />
                )}
                {deckData.status === 'error' && (
                  <div className="rounded-xl border border-destructive/50 bg-slate-800 p-6 md:p-12 text-center">
                    <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4 md:mb-6">
                      <X className="h-6 w-6 md:h-8 md:w-8 text-destructive" />
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold mb-2 text-slate-100">Generation Failed</h2>
                    <p className="text-slate-400 mb-4 md:mb-6 text-sm md:text-base">{deckData.error}</p>
                    <Button onClick={handleGenerateDeck} size="lg" className="w-full md:w-auto">
                      <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      Try Again
                    </Button>
                  </div>
                )}
                {deckData.status === 'completed' && deckData.pdfUrl && (
                  <PDFViewer 
                    url={deckData.pdfUrl} 
                    className="min-h-[50vh] md:min-h-[70vh]"
                  />
                )}
                {deckData.status === 'completed' && !deckData.pdfUrl && deckData.externalUrl && (
                  <div className="rounded-xl border border-slate-600 bg-slate-800 p-12 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-slate-100">Deck Generated!</h2>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto">
                      Your presentation has been created. Click below to view it.
                    </p>
                    <Button size="lg" asChild>
                      <a href={deckData.externalUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-5 w-5" />
                        View Presentation
                      </a>
                    </Button>
                  </div>
                )}
              </>
            )}
            {/* Home Tab */}
            {isHomeTab && (
              <OnboardingTab onNewProposal={handleNewProposal} />
            )}
            {/* Library Tab */}
            {isLibraryTab && (
              <ProposalLibraryTab />
            )}
            {/* Other tabs - no content yet */}
            {!isDeckTab && !isHomeTab && !isLibraryTab && !hasContent && (
              <div className="rounded-xl border border-slate-600 bg-slate-800 p-6 md:p-12 text-center">
                <div className="mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 md:mb-6">
                  <ActiveIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                {!hasProposal ? (
                  <>
                    <h2 className="text-lg md:text-xl font-semibold mb-2 text-slate-100">No Proposal Yet</h2>
                    <p className="text-slate-400 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
                      Create a proposal first, then you can generate {tabLabels[activeTab].toLowerCase()}.
                    </p>
                    <Button onClick={handleNewProposal} size="lg" className="w-full md:w-auto">
                      <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      Create Proposal
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg md:text-xl font-semibold mb-2 text-slate-100">Generate {tabLabels[activeTab]}</h2>
                    <p className="text-slate-400 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
                      This asset hasn't been generated yet. Click below to create it based on your proposal.
                    </p>
                    <Button 
                      onClick={() => handleGenerateAsset(activeTab)}
                      disabled={generatingAsset !== null}
                      size="lg"
                      className="w-full md:w-auto"
                    >
                      {generatingAsset === activeTab ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                          Generate {tabLabels[activeTab]}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            )}
            {!isDeckTab && !isHomeTab && !isLibraryTab && hasContent && activeTab === 'proposal' && lightMode && (
              <StyledProposalPreview
                content={currentContent}
                clientName={clientName}
              />
            )}
            {!isDeckTab && !isHomeTab && !isLibraryTab && hasContent && (activeTab !== 'proposal' || !lightMode) && (
              <div 
                className={`rounded-xl border shadow-lg transition-colors ${
                  lightMode 
                    ? "bg-white border-gray-200" 
                    : "bg-card border-border"
                }`}
                style={lightMode ? {
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  minHeight: '800px'
                } : undefined}
              >
                <div 
                  className={`p-12 ${
                    activeTab === "invoiceDescription"
                      ? "font-mono text-sm"
                      : "font-serif"
                  }`}
                >
                  {currentContent.split("\n").map((line, idx) => {
                    const renderFormattedText = (text: string) => {
                      const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
                      return parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                          return <em key={i}>{part.slice(1, -1)}</em>;
                        }
                        return part;
                      });
                    };

                    const textColor = lightMode ? "text-gray-900" : "text-foreground";
                    const mutedColor = lightMode ? "text-gray-700" : "text-muted-foreground";
                    const headingColor = lightMode ? "text-gray-900" : "text-foreground";
                    const accentColor = lightMode ? "border-blue-600" : "border-primary";

                    if (line.startsWith("# ")) {
                      return (
                        <h1 key={idx} className={`text-3xl font-bold mt-8 mb-6 first:mt-0 ${headingColor} tracking-tight`}>
                          {line.slice(2)}
                        </h1>
                      );
                    }
                    if (line.startsWith("## ")) {
                      return (
                        <h2 key={idx} className={`text-xl font-semibold mt-8 mb-4 pb-2 border-b ${headingColor} ${lightMode ? 'border-gray-200' : 'border-border'}`}>
                          {line.slice(3)}
                        </h2>
                      );
                    }
                    if (line.startsWith("### ")) {
                      return (
                        <h3 key={idx} className={`text-lg font-semibold mt-6 mb-3 ${headingColor}`}>
                          {line.slice(4)}
                        </h3>
                      );
                    }
                    if (line.startsWith("- ") || line.startsWith("• ")) {
                      return (
                        <li key={idx} className={`ml-6 mb-2 ${mutedColor} list-disc`}>
                          {renderFormattedText(line.slice(2))}
                        </li>
                      );
                    }
                    if (/^\d+\.\s/.test(line)) {
                      const match = line.match(/^(\d+)\.\s(.*)$/);
                      if (match) {
                        return (
                          <li key={idx} className={`ml-6 mb-2 ${mutedColor} list-decimal`}>
                            {renderFormattedText(match[2])}
                          </li>
                        );
                      }
                    }
                    if (line.startsWith("✓ ") || line.startsWith("✗ ")) {
                      return (
                        <div key={idx} className={`ml-4 mb-2 flex items-center gap-3 ${mutedColor}`}>
                          <span className={line.startsWith("✓") ? "text-green-600" : "text-red-600"}>
                            {line.charAt(0)}
                          </span>
                          <span>{renderFormattedText(line.slice(2))}</span>
                        </div>
                      );
                    }
                    if (line.startsWith("> ")) {
                      return (
                        <blockquote key={idx} className={`ml-4 pl-4 border-l-4 ${accentColor} ${mutedColor} italic my-4`}>
                          {renderFormattedText(line.slice(2))}
                        </blockquote>
                      );
                    }
                    if (line.trim() === "---" || line.trim() === "***") {
                      return <hr key={idx} className={`my-6 ${lightMode ? 'border-gray-200' : 'border-border'}`} />;
                    }
                    if (line.trim() === "") {
                      return <div key={idx} className="h-4" />;
                    }
                    return (
                      <p key={idx} className={`${mutedColor} leading-relaxed mb-4 text-base`}>
                        {renderFormattedText(line)}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions Bar - hide for home tab */}
        {hasContent && !isHomeTab && (
          <div className="border-t border-border bg-card/50 px-6 py-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Instructions: </span>
              {tabInstructions[activeTab]}
            </p>
          </div>
        )}
      </main>
      </div>

      {/* Edit Proposal Modal */}
      <EditProposalModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onRegenerate={handleRegenerateProposal}
        isRegenerating={isStreaming}
      />

      {/* Loading screen when regenerating proposal */}
      {isStreaming && (
        <LoadingScreen
          context="proposal"
          steps={[
            { label: "Analyzing updated inputs", status: progress < 30 ? 'active' : 'completed' },
            { label: "Restructuring proposal", status: progress < 30 ? 'pending' : progress < 70 ? 'active' : 'completed' },
            { label: "Writing new content", status: progress < 70 ? 'pending' : 'active' },
          ]}
          progress={progress}
          showMetrics={true}
          showTerminal={true}
        />
      )}
      </div>
    </>
  );
}
