import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { ProposalSelector } from "@/components/ProposalSelector";
import { useProposalStore, caseStudies } from "@/lib/proposalStore";
import { supabase } from "@/integrations/supabase/client";
import { PDFViewer } from "@/components/PDFViewer";
import { DeckGeneratingLoader } from "@/components/DeckGeneratingLoader";
import { OnboardingTab } from "@/components/OnboardingTab";
import { ProposalLibraryTab } from "@/components/ProposalLibraryTab";
import { StyledProposalPreview } from "@/components/StyledProposalPreview";
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
  Home,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  
  // Default to "home" unless we came from generate (have a proposal)
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [showBanner, setShowBanner] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatingAsset, setGeneratingAsset] = useState<TabId | null>(null);
  const [lightMode, setLightMode] = useState(true);
  
  const { 
    deliverables, 
    updateDeliverable, 
    reset,
    clientContext,
    clientName,
    background,
    selectedCaseStudies,
    pricingStrategy,
    pricingAI,
    pricingManaged,
    deckData,
    setDeckData,
  } = useProposalStore();

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

  const handleGenerateAsset = async (assetType: TabId) => {
    if (assetType === 'proposal') return;
    if (assetType === 'deck') return;
    
    setGeneratingAsset(assetType);
    
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

      updateDeliverable(assetType as keyof typeof deliverables, data.content);
      
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
      setGeneratingAsset(null);
    }
  };

  // Poll for task completion
  const pollTaskStatus = async (taskId: string, taskUrl: string, shareUrl?: string) => {
    const maxAttempts = 120; // 10 minutes at 5 second intervals
    let attempts = 0;

    const poll = async (): Promise<void> => {
      attempts++;
      console.log(`Polling attempt ${attempts} for task ${taskId}`);

      try {
        const { data, error } = await supabase.functions.invoke('generate-deck', {
          body: { action: 'check', taskId },
        });

        if (error) throw error;
        if (data.error) throw new Error(data.error);

        if (data.status === 'completed') {
          setDeckData({
            status: 'completed',
            generationId: taskId,
            gammaUrl: taskUrl,
            pdfUrl: data.pdfUrl,
            pptxUrl: null,
            thumbnailUrl: null,
          });
          toast({
            title: "Slide deck generated!",
            description: "Your presentation is ready to preview and download.",
          });
          return;
        }

        if (data.status === 'failed') {
          throw new Error(data.error || 'Task failed');
        }

        // Still pending or running - continue polling
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          throw new Error('Generation timed out. Please try again.');
        }
      } catch (err) {
        console.error("Poll error:", err);
        setDeckData({ 
          status: 'error', 
          error: err instanceof Error ? err.message : "Something went wrong." 
        });
        toast({
          title: "Deck generation failed",
          description: err instanceof Error ? err.message : "Something went wrong.",
          variant: "destructive",
        });
      }
    };

    // Start polling after a short delay
    setTimeout(poll, 5000);
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

    setDeckData({ status: 'generating', error: null });

    try {
      const { data, error } = await supabase.functions.invoke('generate-deck', {
        body: {
          deckPrompt: promptToUse,
          clientName: clientName || 'Client',
          numSlides: 10,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Task started - begin polling for completion
      toast({
        title: "Generating slide deck...",
        description: "This typically takes 2-5 minutes. We'll notify you when it's ready.",
      });

      pollTaskStatus(data.taskId, data.taskUrl, data.shareUrl);
    } catch (error) {
      console.error("Deck generation error:", error);
      setDeckData({ 
        status: 'error', 
        error: error instanceof Error ? error.message : "Something went wrong." 
      });
      toast({
        title: "Deck generation failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
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

  const handleNewProposal = () => {
    reset();
    navigate("/generate");
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <AppHeader center={<ProposalSelector />} onNewProposal={handleNewProposal} />

      <div className="flex flex-1 overflow-hidden">
      {/* Sidebar - Fixed height, no scroll needed */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col flex-shrink-0 overflow-hidden">

        {/* Tabs - scrollable if many */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {tabs.filter(tab => tab.id !== 'library').map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isGenerating = generatingAsset === tab.id || (tab.id === 'deck' && deckData.status === 'generating');
            
            let hasTabContent = false;
            if (tab.id === 'home') {
              hasTabContent = true; // Home always has content
            } else if (tab.id === 'deck') {
              hasTabContent = deckData.status === 'completed';
            } else if (tab.id === 'proposal') {
              hasTabContent = !!deliverables?.proposal;
            } else {
              hasTabContent = (deliverables?.[tab.id as keyof typeof deliverables] || '').length > 0;
            }
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="flex-1 text-left">{tab.label}</span>
                {!hasTabContent && tab.id !== 'home' && (
                  <span className="text-xs opacity-60">•</span>
                )}
                {hasTabContent && tab.id !== 'home' && tab.id !== 'proposal' && (
                  <Check className="h-3 w-3 opacity-60" />
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Proposal Library - Separated at bottom */}
        <div className="px-3 pb-2 border-t border-border pt-3">
          <button
            onClick={() => setActiveTab('library')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'library'
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Library className="h-4 w-4" />
            <span className="flex-1 text-left">Proposal Library</span>
          </button>
        </div>

        {/* Sidebar Actions */}
        <div className="p-4 border-t border-border space-y-2">
          {hasContent && !isDeckTab && (
            <>
              <Button onClick={handleCopy} variant="outline" className="w-full justify-start">
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
              <Button onClick={handleDownload} variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </>
          )}
          <div className="border-t border-border pt-3 mt-2 space-y-1">
            <Button onClick={handleNewProposal} variant="ghost" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Generate New
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content - Scrollable */}
      <main className="flex-1 flex flex-col overflow-hidden">
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
          <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-card/30">
            <div className="flex items-center gap-3">
              <ActiveIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">{tabLabels[activeTab]}</span>
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
                  {deckData.gammaUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={deckData.gammaUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Manus
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
                  >
                    {lightMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                    {lightMode ? "Dark" : "PDF View"}
                  </Button>
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    Copy
                  </Button>
                  <Button onClick={handleDownload} variant="outline" size="sm">
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
        <div className={`flex-1 overflow-auto ${isHomeTab || isLibraryTab ? '' : 'p-6'}`}>
          <div className={`mx-auto ${isHomeTab || isLibraryTab ? 'h-full' : isDeckTab ? 'max-w-6xl' : 'max-w-4xl'}`}>
            {/* Deck Tab - Special handling */}
            {isDeckTab && (
              <>
                {deckData.status === 'idle' && (
                  <div className="rounded-xl border border-border bg-card p-12 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Presentation className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Generate Slide Deck</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Create a stunning presentation from your proposal using Manus AI. 
                      This typically takes 2-5 minutes.
                    </p>
                    <Button 
                      onClick={handleGenerateDeck}
                      disabled={!deliverables?.proposal}
                      size="lg"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Slide Deck
                    </Button>
                  </div>
                )}
                {deckData.status === 'generating' && (
                  <DeckGeneratingLoader clientName={clientName} />
                )}
                {deckData.status === 'error' && (
                  <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-12 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
                      <X className="h-8 w-8 text-destructive" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Generation Failed</h2>
                    <p className="text-muted-foreground mb-6">{deckData.error}</p>
                    <Button onClick={handleGenerateDeck} size="lg">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Try Again
                    </Button>
                  </div>
                )}
                {deckData.status === 'completed' && deckData.pdfUrl && (
                  <PDFViewer 
                    url={deckData.pdfUrl} 
                    className="min-h-[70vh]"
                  />
                )}
                {deckData.status === 'completed' && !deckData.pdfUrl && deckData.gammaUrl && (
                  <div className="rounded-xl border border-border bg-card p-12 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Deck Generated!</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Your presentation has been created. Click below to view it on Manus.
                    </p>
                    <Button size="lg" asChild>
                      <a href={deckData.gammaUrl} target="_blank" rel="noopener noreferrer">
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
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <ActiveIcon className="h-8 w-8 text-primary" />
                </div>
                {!hasProposal ? (
                  <>
                    <h2 className="text-xl font-semibold mb-2">No Proposal Yet</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Create a proposal first, then you can generate {tabLabels[activeTab].toLowerCase()}.
                    </p>
                    <Button onClick={handleNewProposal} size="lg">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create Proposal
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-2">Generate {tabLabels[activeTab]}</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      This asset hasn't been generated yet. Click below to create it based on your proposal.
                    </p>
                    <Button 
                      onClick={() => handleGenerateAsset(activeTab)}
                      disabled={generatingAsset !== null}
                      size="lg"
                    >
                      {generatingAsset === activeTab ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
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
    </div>
  );
}
