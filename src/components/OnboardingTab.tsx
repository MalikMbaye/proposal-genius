import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Presentation,
  FileCheck,
  Mail,
  Receipt,
  ArrowRight,
  Clock,
  Sparkles,
  HelpCircle,
  User,
  Settings,
  Zap,
  CheckCircle2,
  PenLine,
  MousePointerClick,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const deliverables = [
  { icon: FileText, title: "Proposal", color: "bg-blue-500" },
  { icon: Presentation, title: "Slide Deck", color: "bg-purple-500" },
  { icon: FileCheck, title: "Contract", color: "bg-green-500" },
  { icon: Mail, title: "Emails", color: "bg-orange-500" },
  { icon: Receipt, title: "Invoice", color: "bg-pink-500" },
];

const steps = [
  {
    number: "1",
    title: "Set Up Your Profile",
    description: "Add your business context, credentials, and proof points so every proposal feels personal.",
    icon: User,
    action: { label: "Go to Profile", to: "/profile" },
  },
  {
    number: "2",
    title: "Create a Proposal",
    description: "Click 'New Proposal', paste your client context, select case studies, and hit generate.",
    icon: PenLine,
    action: { label: "New Proposal", to: "/generate" },
  },
  {
    number: "3",
    title: "Generate Assets",
    description: "Use the sidebar tabs to generate slide decks, contracts, and emails from your proposal.",
    icon: MousePointerClick,
    action: null,
  },
];

const faqs = [
  {
    question: "How long does proposal generation take?",
    answer: "About 30-60 seconds. You'll see content streaming in real-time.",
  },
  {
    question: "How long does the slide deck take?",
    answer: "2-5 minutes. Our AI designer carefully creates each slide. You'll be notified when ready.",
  },
  {
    question: "Can I edit the generated content?",
    answer: "Yes! Copy to Google Docs or your preferred editor to customize before sending.",
  },
  {
    question: "What makes these proposals different?",
    answer: "Trained on real proposals that won over $1 million in contracts. Battle-tested structure and language.",
  },
  {
    question: "Where are my proposals saved?",
    answer: "Automatically saved! Access them from 'Saved Proposals' in the profile menu or proposal dropdown.",
  },
];

interface OnboardingTabProps {
  onNewProposal: () => void;
}

export function OnboardingTab({ onNewProposal }: OnboardingTabProps) {
  return (
    <div className="h-full overflow-auto bg-white dark:bg-slate-50">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Proposals
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Welcome to Proposal AI
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Generate winning proposals, slide decks, contracts, and emails — all trained on real proposals that won over{" "}
            <span className="font-semibold text-primary">$1 million</span> in contracts.
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center mb-14">
          <Button onClick={onNewProposal} size="lg" className="text-base px-8 bg-primary hover:bg-primary/90">
            <Zap className="mr-2 h-5 w-5" />
            Create New Proposal
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* What You Get */}
        <div className="mb-14">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">
            What You'll Generate
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {deliverables.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-2.5 rounded-full bg-slate-100 px-4 py-2"
                >
                  <div className={`rounded-full p-1.5 ${item.color}`}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">How It Works</h2>
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex items-start gap-4 rounded-xl bg-slate-50 border border-slate-200 p-5"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-slate-900">{step.title}</h3>
                    </div>
                    <p className="text-slate-600 text-sm">{step.description}</p>
                  </div>
                  {step.action && (
                    <Button asChild variant="outline" size="sm" className="flex-shrink-0 border-slate-300 text-slate-700 hover:bg-slate-100">
                      <Link to={step.action.to}>
                        {step.action.label}
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Note */}
        <div className="mb-14 rounded-xl bg-amber-50 border border-amber-200 p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 rounded-full bg-amber-100 p-2.5">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">About Slide Deck Generation</h3>
              <p className="text-amber-800 text-sm">
                Our AI designer creates beautiful presentations, but good design takes time. 
                Expect <strong>2-5 minutes</strong> for your deck. We'll notify you when it's ready — 
                feel free to work on other things while you wait.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-900">FAQ</h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="border-slate-200"
                >
                  <AccordionTrigger className="px-5 py-4 text-left text-slate-900 hover:no-underline hover:bg-slate-50 text-sm">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4 text-slate-600 text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="text-center pt-4 pb-8">
          <p className="text-slate-500 text-sm mb-3">Need to update your credentials?</p>
          <Button asChild variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100">
            <Link to="/profile">
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
