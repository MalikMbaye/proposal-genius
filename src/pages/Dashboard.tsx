import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import {
  FileText,
  Presentation,
  FileCheck,
  Mail,
  Receipt,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronDown,
  User,
  Settings,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const deliverables = [
  {
    icon: FileText,
    title: "Full Proposal",
    description: "Complete written proposal tailored to your client's needs",
  },
  {
    icon: Presentation,
    title: "Slide Deck",
    description: "Professional AI-designed presentation (2-5 min generation)",
  },
  {
    icon: FileCheck,
    title: "Contract",
    description: "Ready-to-sign contract with your terms",
  },
  {
    icon: Mail,
    title: "Emails",
    description: "Proposal and contract sending emails",
  },
  {
    icon: Receipt,
    title: "Invoice Description",
    description: "Copy for your invoicing system",
  },
];

const steps = [
  {
    number: "01",
    title: "Set Up Your Account",
    description: "Add context about your business, credentials, and proof points in your profile settings.",
    icon: User,
  },
  {
    number: "02",
    title: "Create a New Proposal",
    description: "Click 'New Proposal', enter your client info, and select relevant case studies.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Generate Your Assets",
    description: "Get your proposal, then use the tabs to generate slide decks, contracts, and emails.",
    icon: Sparkles,
  },
];

const faqs = [
  {
    question: "How long does it take to generate a proposal?",
    answer: "The written proposal generates in about 30-60 seconds. You'll see the content streaming in real-time as it's being written.",
  },
  {
    question: "How long does the slide deck take?",
    answer: "The AI-designed slide deck takes 2-5 minutes to generate. Our AI designer carefully creates each slide, so we recommend grabbing a coffee while it works. You'll be notified when it's ready.",
  },
  {
    question: "Can I edit the generated content?",
    answer: "Yes! All generated content is meant as a starting point. Copy it to Google Docs or your preferred editor to customize before sending to clients.",
  },
  {
    question: "What makes these proposals different?",
    answer: "Our AI is trained on real proposals that have won over $1 million in contracts. The structure, language, and persuasion techniques are battle-tested.",
  },
  {
    question: "How do I customize for my business?",
    answer: "Go to your Profile settings to add your business context, background, and proof points. This information is used to personalize every proposal you generate.",
  },
  {
    question: "Can I save and revisit proposals?",
    answer: "Absolutely! All your proposals are automatically saved. Access them anytime from 'Saved Proposals' in your profile menu.",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Proposal Generation
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Proposal AI</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate winning proposals, slide decks, contracts, and emails — all trained on real proposals that have won over <span className="text-primary font-semibold">$1 million</span> in contracts.
          </p>
        </div>

        {/* Quick Action */}
        <div className="flex justify-center mb-16">
          <Button asChild variant="hero" size="lg" className="text-lg px-8">
            <Link to="/generate">
              <Zap className="mr-2 h-5 w-5" />
              Create New Proposal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* What You Get Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">What You'll Get</h2>
            <p className="text-muted-foreground">
              A complete suite of client-ready deliverables
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {deliverables.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="rounded-lg bg-primary/10 p-2.5 w-fit mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">How It Works</h2>
            <p className="text-muted-foreground">
              Three simple steps to professional proposals
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Important Notes */}
        <section className="mb-16">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">About Slide Deck Generation</h3>
                <p className="text-muted-foreground">
                  Our AI designer creates beautiful, professional slide decks — but good design takes time. 
                  Expect <strong>2-5 minutes</strong> for your deck to generate. We'll notify you when it's ready, 
                  so feel free to work on other things while you wait.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm mb-4">
              <HelpCircle className="h-4 w-4" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl font-bold">Got Questions?</h2>
          </div>
          <div className="rounded-xl border border-border bg-card">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border">
                  <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Quick Links */}
        <section className="text-center pb-8">
          <p className="text-muted-foreground mb-4">Ready to get started?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline">
              <Link to="/profile">
                <Settings className="mr-2 h-4 w-4" />
                Set Up Profile
              </Link>
            </Button>
            <Button asChild variant="hero">
              <Link to="/generate">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Proposal
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
