import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useProposalStore, caseStudies } from "@/lib/proposalStore";
import { supabase } from "@/integrations/supabase/client";
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
  FileDown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const tabs = [
  { id: "proposal", label: "Proposal", icon: FileText },
  { id: "deck", label: "Slide Deck", icon: Presentation },
  { id: "deckPrompt", label: "Deck Prompt", icon: FileText },
  { id: "contract", label: "Contract", icon: FileCheck },
  { id: "contractEmail", label: "Contract Email", icon: Send },
  { id: "invoiceDescription", label: "Invoice", icon: Receipt },
  { id: "proposalEmail", label: "Proposal Email", icon: Mail },
] as const;

type TabId = (typeof tabs)[number]["id"];

const tabInstructions: Record<TabId, string> = {
  proposal: "Copy and paste into Google Docs or Word. Review, save as PDF, send.",
  deck: "Preview your AI-generated slide deck. Download as PDF or PPTX.",
  deckPrompt: "Copy entire prompt. Paste into GenSpark AI Slides. Click Generate.",
  contract: "Paste into Square Contracts. Fill in [BRACKETED] fields. Send for signature.",
  contractEmail: "Copy and paste into your email client. Customize the [BRACKETED] fields.",
  invoiceDescription: "Copy and paste into your invoice or accounting system.",
  proposalEmail: "Copy and paste into your email client. Customize and send.",
};

const tabLabels: Record<TabId, string> = {
  proposal: "Proposal",
  deck: "Slide Deck",
  deckPrompt: "Deck Prompt",
  contract: "Contract",
  contractEmail: "Contract Email",
  invoiceDescription: "Invoice Description",
  proposalEmail: "Proposal Email",
};

export default function Preview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("proposal");
  const [showBanner, setShowBanner] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generatingAsset, setGeneratingAsset] = useState<TabId | null>(null);
  const [lightMode, setLightMode] = useState(true); // PDF-like preview by default
  
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

  useEffect(() => {
    if (!deliverables || !deliverables.proposal) {
      navigate("/generate");
    }
  }, [deliverables, navigate]);

  if (!deliverables || !deliverables.proposal) {
    return null;
  }

  // For deck tab, check deckData; for others, check deliverables
  const isDeckTab = activeTab === 'deck';
  const currentContent = isDeckTab ? '' : (deliverables[activeTab as keyof typeof deliverables] || '');
  const hasContent = isDeckTab ? deckData.status === 'completed' : currentContent.length > 0;
  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon || FileText;

  const handleGenerateAsset = async (assetType: TabId) => {
    if (assetType === 'proposal') return; // Proposal is already generated
    if (assetType === 'deck') return; // Deck has its own handler
    
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
          proposalContent: deliverables.proposal,
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

  const handleGenerateDeck = async () => {
    if (!deliverables.deckPrompt) {
      toast({
        title: "Deck prompt required",
        description: "Please generate the deck prompt first.",
        variant: "destructive",
      });
      return;
    }

    setDeckData({ status: 'generating', error: null });

    try {
      const { data, error } = await supabase.functions.invoke('generate-deck', {
        body: {
          deckPrompt: deliverables.deckPrompt,
          clientName: clientName || 'Client',
          numSlides: 10,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setDeckData({
        status: 'completed',
        generationId: data.generationId,
        gammaUrl: data.gammaUrl,
        pdfUrl: data.pdfUrl,
        pptxUrl: data.pptxUrl,
        thumbnailUrl: data.thumbnailUrl,
      });

      toast({
        title: "Slide deck generated!",
        description: "Your presentation is ready to preview and download.",
      });
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
      // Skip empty lines but add spacing
      if (line.trim() === "") {
        y += 4;
        return;
      }

      // Horizontal rule
      if (line.trim() === "---" || line.trim() === "***") {
        addNewPageIfNeeded(8);
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 8;
        return;
      }

      // H1
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

      // H2
      if (line.startsWith("## ")) {
        addNewPageIfNeeded(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        const text = stripMarkdown(line.slice(3));
        const splitText = doc.splitTextToSize(text, maxWidth);
        doc.text(splitText, margin, y);
        y += splitText.length * 6 + 4;
        // Add underline
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y - 2, pageWidth - margin, y - 2);
        y += 4;
        return;
      }

      // H3
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

      // Bullet points
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

      // Numbered lists
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

      // Checkmarks and X marks
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

      // Blockquotes
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

      // Regular paragraph
      addNewPageIfNeeded(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const text = stripMarkdown(line);
      const splitText = doc.splitTextToSize(text, maxWidth);
      doc.text(splitText, margin, y);
      y += splitText.length * 4 + 3;
    });

    // Add page numbers
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Tabs */}
        <nav className="flex-1 p-3 space-y-1">
        {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isGenerating = generatingAsset === tab.id || (tab.id === 'deck' && deckData.status === 'generating');
            
            // Determine if tab has content
            let hasTabContent = false;
            if (tab.id === 'deck') {
              hasTabContent = deckData.status === 'completed';
            } else if (tab.id !== 'proposal') {
              hasTabContent = (deliverables[tab.id as keyof typeof deliverables] || '').length > 0;
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
                {!hasTabContent && tab.id !== 'proposal' && (
                  <span className="text-xs opacity-60">•</span>
                )}
                {hasTabContent && tab.id !== 'proposal' && (
                  <Check className="h-3 w-3 opacity-60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Actions */}
        <div className="p-4 border-t border-border space-y-2">
          {hasContent && (
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
          <div className="border-t border-border pt-2 mt-2">
            <Button onClick={handleNewProposal} variant="ghost" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Generate New
            </Button>
          </div>

          {/* GenSpark CTA for Deck Prompt */}
          {activeTab === "deckPrompt" && hasContent && (
            <div className="mt-4 rounded-lg bg-primary/10 border border-primary/20 p-4">
              <h4 className="font-semibold text-sm mb-2">Create Your Deck</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Copy this prompt and paste into GenSpark AI Slides
              </p>
              <Button size="sm" className="w-full" asChild>
                <a
                  href="https://www.genspark.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open GenSpark
                  <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
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

        {/* Document Header */}
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
                  <Button size="sm" variant="outline" asChild>
                    <a href={deckData.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <FileDown className="mr-2 h-4 w-4" />
                      Download PDF
                    </a>
                  </Button>
                )}
                {deckData.pptxUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={deckData.pptxUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download PPTX
                    </a>
                  </Button>
                )}
                {deckData.gammaUrl && (
                  <Button size="sm" asChild>
                    <a href={deckData.gammaUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Edit in Gamma
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

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className={`mx-auto ${isDeckTab ? 'max-w-6xl' : 'max-w-4xl'}`}>
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
                      {deliverables.deckPrompt 
                        ? "Create a professional presentation from your deck prompt using Gamma AI."
                        : "First generate the Deck Prompt, then come back here to create your slides."}
                    </p>
                    <Button 
                      onClick={handleGenerateDeck}
                      disabled={!deliverables.deckPrompt}
                      size="lg"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Slide Deck
                    </Button>
                  </div>
                )}
                {deckData.status === 'generating' && (
                  <div className="rounded-xl border border-border bg-card p-12 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Generating Your Deck...</h2>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Gamma AI is creating your presentation. This may take 1-2 minutes.
                    </p>
                    <div className="flex justify-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
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
                {deckData.status === 'completed' && deckData.gammaUrl && (
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <iframe 
                      src={`https://gamma.app/embed/${deckData.gammaUrl.split('/').pop()}`}
                      className="w-full"
                      style={{ height: '70vh', minHeight: '500px' }}
                      title="Slide Deck Preview"
                      allow="fullscreen"
                    />
                    <div className="p-3 text-center border-t border-border bg-muted/30">
                      <p className="text-sm text-muted-foreground">
                        Can't see the preview?{' '}
                        <a 
                          href={deckData.gammaUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Open in Gamma
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
            {/* Other tabs */}
            {!isDeckTab && !hasContent && (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <ActiveIcon className="h-8 w-8 text-primary" />
                </div>
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
              </div>
            )}
            {!isDeckTab && hasContent && (
              // Document Content - PDF-like preview
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
                    activeTab === "deckPrompt" || activeTab === "invoiceDescription"
                      ? "font-mono text-sm"
                      : "font-serif"
                  }`}
                >
                  {currentContent.split("\n").map((line, idx) => {
                    // Enhanced markdown rendering
                    const renderFormattedText = (text: string) => {
                      // Handle bold (**text**) and italic (*text*)
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

        {/* Instructions Bar */}
        {hasContent && (
          <div className="border-t border-border bg-card/50 px-6 py-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Instructions: </span>
              {tabInstructions[activeTab]}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
