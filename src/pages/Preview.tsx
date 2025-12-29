import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useProposalStore } from "@/lib/proposalStore";
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const tabs = [
  { id: "proposal", label: "Proposal", icon: FileText },
  { id: "deckPrompt", label: "Deck Prompt", icon: Presentation },
  { id: "contract", label: "Contract", icon: FileCheck },
  { id: "contractEmail", label: "Contract Email", icon: Send },
  { id: "invoiceDescription", label: "Invoice", icon: Receipt },
  { id: "proposalEmail", label: "Proposal Email", icon: Mail },
] as const;

type TabId = (typeof tabs)[number]["id"];

const tabInstructions: Record<TabId, string> = {
  proposal: "Copy and paste into Google Docs or Word. Review, save as PDF, send.",
  deckPrompt: "Copy entire prompt. Paste into GenSpark AI Slides. Click Generate.",
  contract: "Paste into Square Contracts. Fill in [BRACKETED] fields. Send for signature.",
  contractEmail: "Copy and paste into your email client. Customize the [BRACKETED] fields.",
  invoiceDescription: "Copy and paste into your invoice or accounting system.",
  proposalEmail: "Copy and paste into your email client. Customize and send.",
};

export default function Preview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("proposal");
  const [showBanner, setShowBanner] = useState(true);
  const [copied, setCopied] = useState(false);
  const { deliverables, reset } = useProposalStore();

  useEffect(() => {
    if (!deliverables) {
      navigate("/generate");
    }
  }, [deliverables, navigate]);

  if (!deliverables) {
    return null;
  }

  const currentContent = deliverables[activeTab];
  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon || FileText;

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
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Actions */}
        <div className="p-4 border-t border-border space-y-2">
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
          <div className="border-t border-border pt-2 mt-2">
            <Button onClick={handleNewProposal} variant="ghost" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Generate New
            </Button>
          </div>

          {/* GenSpark CTA for Deck Prompt */}
          {activeTab === "deckPrompt" && (
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
                Your proposal package is ready! Preview each deliverable and copy what you need.
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
            <span className="font-semibold">Document</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCopy} variant="outline" size="sm">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              Copy
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            {activeTab === "deckPrompt" && (
              <Button size="sm" asChild>
                <a
                  href="https://www.genspark.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open GenSpark
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-border bg-card p-8">
              <div
                className={`prose prose-invert max-w-none ${
                  activeTab === "deckPrompt" || activeTab === "invoiceDescription"
                    ? "font-mono text-sm"
                    : ""
                }`}
              >
                {currentContent.split("\n").map((line, idx) => {
                  if (line.startsWith("# ")) {
                    return (
                      <h1 key={idx} className="text-2xl font-bold mt-8 mb-4 first:mt-0">
                        {line.slice(2)}
                      </h1>
                    );
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h2 key={idx} className="text-xl font-semibold mt-6 mb-3 border-l-4 border-primary pl-4">
                        {line.slice(3)}
                      </h2>
                    );
                  }
                  if (line.startsWith("### ")) {
                    return (
                      <h3 key={idx} className="text-lg font-semibold mt-4 mb-2">
                        {line.slice(4)}
                      </h3>
                    );
                  }
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p key={idx} className="font-bold mt-4 mb-2">
                        {line.slice(2, -2)}
                      </p>
                    );
                  }
                  if (line.startsWith("- ") || line.startsWith("• ")) {
                    return (
                      <li key={idx} className="ml-4 text-muted-foreground">
                        {line.slice(2)}
                      </li>
                    );
                  }
                  if (line.startsWith("✓ ") || line.startsWith("✗ ")) {
                    return (
                      <li key={idx} className="ml-4 flex items-center gap-2">
                        <span className={line.startsWith("✓") ? "text-success" : "text-destructive"}>
                          {line.charAt(0)}
                        </span>
                        <span className="text-muted-foreground">{line.slice(2)}</span>
                      </li>
                    );
                  }
                  if (line.trim() === "") {
                    return <br key={idx} />;
                  }
                  return (
                    <p key={idx} className="text-muted-foreground leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Bar */}
        <div className="border-t border-border bg-card/50 px-6 py-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Instructions: </span>
            {tabInstructions[activeTab]}
          </p>
        </div>
      </main>
    </div>
  );
}
