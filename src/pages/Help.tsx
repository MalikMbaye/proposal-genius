import { useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Presentation,
  FileCheck,
  Mail,
  Receipt,
  Send,
  Library,
  MessageSquare,
  Phone,
  Target,
  Lightbulb,
  DollarSign,
  Users,
  Rocket,
  ChevronDown,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  content: {
    whatItIs: string;
    howToUse: string[];
    proTips: string[];
    commonMistakes?: string[];
  };
}

const helpSections: HelpSection[] = [
  {
    id: "methodology",
    title: "The PitchGenius Methodology",
    icon: Target,
    description: "Our proven framework for winning more deals",
    content: {
      whatItIs: "PitchGenius is built on a simple principle: professionals who present themselves with clarity, structure, and confidence close more deals. Our methodology combines AI-powered content generation with battle-tested sales frameworks to help you create compelling pitch materials in minutes, not hours.",
      howToUse: [
        "Start with your client's context — the more specific, the better your outputs",
        "Generate your core proposal first — it becomes the foundation for all other assets",
        "Build out your pitch kit piece by piece: deck, contract, emails, invoices",
        "Customize and personalize before sending — AI gets you 80% there, you add the 20%",
      ],
      proTips: [
        "The best proposals diagnose before prescribing — show you understand their problem",
        "Include specific numbers and outcomes, not vague promises",
        "Price based on value delivered, not hours worked",
        "Always include clear next steps and a deadline",
      ],
    },
  },
  {
    id: "proposal",
    title: "Written Proposals",
    icon: FileText,
    description: "The foundation of your pitch kit",
    content: {
      whatItIs: "Your AI-generated proposal is a comprehensive document that outlines scope, approach, pricing, and why you're the right choice. It's designed to be professional, persuasive, and ready to customize.",
      howToUse: [
        "Fill out the client context with as much detail as possible",
        "Add your background and credentials in your profile (one-time setup)",
        "Set pricing tiers that reflect your value",
        "Generate and review — edit the [BRACKETED] placeholders",
        "Export to PDF or paste into Google Docs/Word",
      ],
      proTips: [
        "Written proposals close deals 2-3x faster than verbal quotes",
        "Send within 24 hours of your discovery call for maximum impact",
        "Include 2-3 pricing options — clients prefer choice",
        "Follow up 3 days after sending if you don't hear back",
      ],
      commonMistakes: [
        "Being too vague about deliverables",
        "Not including a clear timeline",
        "Forgetting to personalize the opening",
        "Waiting too long to send after the initial conversation",
      ],
    },
  },
  {
    id: "deck",
    title: "Slide Decks",
    icon: Presentation,
    description: "Visual presentations that make your pitch memorable",
    content: {
      whatItIs: "Transform your proposal into a stunning visual presentation — perfect for live pitches, video calls, or leaving behind after meetings. Each deck is custom-designed with data visualizations and professional layouts.",
      howToUse: [
        "Generate your written proposal first (required)",
        "Click 'Generate Slide Deck' — takes 5-7 minutes",
        "You can switch tabs while it builds — we work in the background",
        "Download as PDF or PPTX (editable in PowerPoint/Google Slides)",
      ],
      proTips: [
        "Visual presentations increase message retention by 65%",
        "Use the deck for live pitches, the proposal for follow-up",
        "Keep each slide focused on one key point",
        "Practice your presentation before the call",
      ],
      commonMistakes: [
        "Reading slides word-for-word during presentations",
        "Cramming too much information on one slide",
        "Not customizing the deck for your specific client",
      ],
    },
  },
  {
    id: "contract",
    title: "Service Contracts",
    icon: FileCheck,
    description: "Seal the deal with professional agreements",
    content: {
      whatItIs: "A legally-structured contract generated from your proposal — with payment terms, scope of work, and project milestones ready to customize. Protects both you and your client.",
      howToUse: [
        "Generate after the client agrees to your proposal",
        "Fill in all [BRACKETED] fields with specific details",
        "Upload to Square Contracts, DocuSign, or your preferred e-sign tool",
        "Send with the Contract Email for a professional touchpoint",
      ],
      proTips: [
        "Professional contracts make clients take you more seriously",
        "Protects you from scope creep and payment disputes",
        "Include a kill fee or cancellation clause",
        "Get the first payment before starting work",
      ],
      commonMistakes: [
        "Starting work before the contract is signed",
        "Not defining what happens if scope changes",
        "Leaving payment terms vague",
      ],
    },
  },
  {
    id: "emails",
    title: "Email Templates",
    icon: Mail,
    description: "Professional emails that get responses",
    content: {
      whatItIs: "Pre-written emails to accompany your proposal and contract. These are designed to reduce friction, answer common questions upfront, and include clear calls-to-action.",
      howToUse: [
        "Generate the Proposal Email when you're ready to send your proposal",
        "Generate the Contract Email when the client says 'yes'",
        "Personalize the opening line with something specific from your conversation",
        "Send within 24 hours of your discussion",
      ],
      proTips: [
        "Good delivery emails reduce time-to-signature by days",
        "Keep emails short — 150 words max for the main body",
        "Always include a specific ask and deadline",
        "Follow up if you don't hear back in 3 business days",
      ],
      commonMistakes: [
        "Writing novels instead of concise emails",
        "Not including a clear call-to-action",
        "Being too formal or too casual for the relationship",
      ],
    },
  },
  {
    id: "invoice",
    title: "Invoice Descriptions",
    icon: Receipt,
    description: "Clear line items that reduce payment questions",
    content: {
      whatItIs: "Pre-formatted invoice descriptions and line items you can paste directly into your invoicing tool — Stripe, QuickBooks, FreshBooks, or whatever you use.",
      howToUse: [
        "Generate after the contract is signed",
        "Copy line items into your invoicing software",
        "Adjust quantities or line items as needed",
        "Send immediately or schedule for milestone dates",
      ],
      proTips: [
        "Clear invoice descriptions reduce payment disputes",
        "Break large projects into milestone payments",
        "Include payment terms on every invoice (Net 15, Net 30)",
        "Send invoices on the same day each time for consistency",
      ],
      commonMistakes: [
        "Vague descriptions like 'Consulting services'",
        "Not including project reference or PO number",
        "Waiting too long to invoice after work is completed",
      ],
    },
  },
  {
    id: "library",
    title: "Proposal Library",
    icon: Library,
    description: "Learn from 50+ winning proposals",
    content: {
      whatItIs: "Access real proposals that closed real deals — from agencies, consultants, and freelancers across industries. Study what works and adapt it to your own style.",
      howToUse: [
        "Browse proposals in your industry first",
        "Study the structure, not just the content",
        "Pay attention to how pricing is presented",
        "Note how they handle objections and risks",
      ],
      proTips: [
        "Look at proposals in adjacent industries for fresh ideas",
        "Study both the winners and the structure patterns",
        "Use proven frameworks, but make them your own",
        "Save your favorites for quick reference",
      ],
      commonMistakes: [
        "Copying content word-for-word instead of adapting",
        "Ignoring proposals outside your industry",
        "Not paying attention to the psychology behind the structure",
      ],
    },
  },
  {
    id: "dm-assistant",
    title: "DM Sales Assistant",
    icon: MessageSquare,
    description: "Turn cold DMs into warm conversations",
    content: {
      whatItIs: "Upload screenshots of DM conversations and get AI-powered analysis of where the prospect is in the buying journey, plus suggested responses to move them forward.",
      howToUse: [
        "Screenshot your DM conversation on Instagram, LinkedIn, or Twitter",
        "Upload to the DM Closer tool",
        "Review the analysis: qualification score, buying signals, objections",
        "Choose from suggested responses or customize",
      ],
      proTips: [
        "Respond within 15 minutes when possible — speed wins",
        "Focus on understanding before pitching",
        "Ask questions that reveal budget and timeline",
        "Move high-intent prospects to a call quickly",
      ],
      commonMistakes: [
        "Pitching too early in the conversation",
        "Ignoring buying signals",
        "Being too salesy instead of helpful",
        "Taking too long to respond",
      ],
    },
  },
  {
    id: "call-script",
    title: "Call Script Generator",
    icon: Phone,
    description: "Never freeze on a discovery call again",
    content: {
      whatItIs: "AI-generated call scripts customized to your client and project. Includes opening hooks, discovery questions, pricing discussions, and closing techniques.",
      howToUse: [
        "Generate after filling out client context",
        "Review and familiarize yourself with the flow",
        "Use as a guide, not a rigid script",
        "Take notes during the call for follow-up",
      ],
      proTips: [
        "The best discovery calls are 70% listening, 30% talking",
        "Ask about their current situation before pitching solutions",
        "Confirm budget range early to avoid wasted time",
        "End every call with a clear next step",
      ],
      commonMistakes: [
        "Reading the script word-for-word",
        "Talking too much about yourself",
        "Not asking about budget or timeline",
        "Ending without a clear next step",
      ],
    },
  },
  {
    id: "milkzo",
    title: "MilkZo AI Assistant",
    icon: Sparkles,
    description: "Your evil genius sidekick — ask anything, anytime",
    content: {
      whatItIs: "MilkZo is your personal AI assistant that lives in the bottom-right corner of every page. Ask questions about PitchGenius, get help with your pitch strategy, submit feedback, or book a strategy call — all from one place. MilkZo uses conversational AI to help you close more deals.",
      howToUse: [
        "Click the orange chat bubble in the bottom-right corner",
        "Complete the quick verification (solves a simple math problem)",
        "Ask any question about PitchGenius features or sales strategy",
        "Use the 'Book a Call' button to schedule a strategy session with Malik",
        "Use the 'Feedback' button to share ideas, report issues, or send love",
      ],
      proTips: [
        "MilkZo is trained on proven sales methodology to help you close deals",
        "Ask for help with specific situations — the more context, the better advice",
        "MilkZo can help you think through objections and pricing conversations",
        "Available 24/7 — use it whenever you're stuck or need a second opinion",
        "Your chat session persists while you browse — pick up where you left off",
      ],
      commonMistakes: [
        "Not using MilkZo when you have quick questions",
        "Forgetting to book a call when you need personalized, hands-on help",
        "Not giving enough context about your specific situation",
      ],
    },
  },
  {
    id: "security",
    title: "Security & Privacy",
    icon: CheckCircle2,
    description: "Your data and conversations are protected",
    content: {
      whatItIs: "PitchGenius takes security seriously. Your proposals, client data, and conversations are protected. We use industry-standard practices to keep your business information safe.",
      howToUse: [
        "Your proposals are tied to your account and only visible to you",
        "Client information you enter is used only to generate your materials",
        "We never share your data with third parties for marketing purposes",
        "Log out when using shared computers to protect your account",
      ],
      proTips: [
        "Use a strong, unique password for your PitchGenius account",
        "Enable two-factor authentication for extra protection",
        "Review your proposals before sharing — you control what gets sent",
        "Reach out to support if you notice any unusual activity",
      ],
      commonMistakes: [
        "Sharing login credentials with others",
        "Leaving your account logged in on public computers",
        "Not reviewing AI-generated content before sending to clients",
      ],
    },
  },
];

const workflowSteps = [
  {
    step: 1,
    title: "Discovery",
    description: "Have a conversation with your prospect to understand their needs, goals, and budget.",
    tools: ["DM Sales Assistant", "Call Script Generator"],
  },
  {
    step: 2,
    title: "Proposal",
    description: "Generate a comprehensive proposal that addresses their specific situation.",
    tools: ["Written Proposal", "Proposal Email"],
  },
  {
    step: 3,
    title: "Presentation",
    description: "Present your solution with a visual deck for live pitches or follow-up.",
    tools: ["Slide Deck"],
  },
  {
    step: 4,
    title: "Close",
    description: "Seal the deal with a professional contract and clear next steps.",
    tools: ["Service Contract", "Contract Email"],
  },
  {
    step: 5,
    title: "Get Paid",
    description: "Invoice promptly with clear descriptions to ensure smooth payment.",
    tools: ["Invoice Descriptions"],
  },
];

export default function Help() {
  const [expandedSection, setExpandedSection] = useState<string | null>("methodology");

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-radial-gradient" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="relative">
        <AppHeader />

        <main className="pt-10 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Link
              to="/profile"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Link>

            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Help Center</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn the PitchGenius methodology and master every tool in your pitch kit.
              </p>
            </div>

            {/* Quick Workflow Overview */}
            <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                The Winning Workflow
              </h2>
              <div className="grid gap-4">
                {workflowSteps.map((step, index) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
                        {step.step}
                      </div>
                      {index < workflowSteps.length - 1 && (
                        <div className="w-px h-8 bg-border mx-auto mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.tools.map((tool) => (
                          <span
                            key={tool}
                            className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-3">
              {helpSections.map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSection === section.id;

                return (
                  <div
                    key={section.id}
                    className="glass-card rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center gap-4 p-4 md:p-5 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{section.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {section.description}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 md:px-5 pb-5 space-y-5 border-t border-border pt-5">
                        {/* What It Is */}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
                            What It Is
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {section.content.whatItIs}
                          </p>
                        </div>

                        {/* How To Use */}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
                            How To Use
                          </h4>
                          <ul className="space-y-2">
                            {section.content.howToUse.map((item, i) => (
                              <li key={i} className="flex gap-2 text-muted-foreground">
                                <span className="text-primary font-semibold">{i + 1}.</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Pro Tips */}
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                          <h4 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Pro Tips
                          </h4>
                          <ul className="space-y-2">
                            {section.content.proTips.map((tip, i) => (
                              <li key={i} className="flex gap-2 text-muted-foreground text-sm">
                                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Common Mistakes */}
                        {section.content.commonMistakes && (
                          <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/10">
                            <h4 className="text-sm font-semibold text-destructive uppercase tracking-wide mb-2">
                              Common Mistakes to Avoid
                            </h4>
                            <ul className="space-y-1">
                              {section.content.commonMistakes.map((mistake, i) => (
                                <li key={i} className="text-muted-foreground text-sm flex gap-2">
                                  <span className="text-destructive">✗</span>
                                  <span>{mistake}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <h2 className="text-xl font-bold mb-2">Ready to win more deals?</h2>
                <p className="text-muted-foreground mb-6">
                  Start building your pitch kit now.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg">
                    <Link to="/generate">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create New Proposal
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link to="/preview">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
