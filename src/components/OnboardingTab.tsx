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
  Coffee,
  Trophy,
  Timer,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const deliverables = [
  { icon: FileText, title: "Proposal", time: "~30 sec", color: "bg-blue-500" },
  { icon: Presentation, title: "Slide Deck", time: "5-7 min", color: "bg-purple-500", premium: true },
  { icon: FileCheck, title: "Contract", time: "~30 sec", color: "bg-green-500" },
  { icon: Mail, title: "Emails", time: "~15 sec", color: "bg-orange-500" },
  { icon: Receipt, title: "Invoice", time: "~15 sec", color: "bg-pink-500" },
];

const faqs = [
  {
    question: "Why does the slide deck take longer?",
    answer: "Great design takes time. Our AI designer creates each slide from scratch with custom layouts, visuals, and animations. This isn't a template slap — it's bespoke work. Worth the wait.",
  },
  {
    question: "Can I work on other things while it generates?",
    answer: "Absolutely. Generate your deck, go grab lunch, reply to some emails. We'll have it ready when you get back. No need to babysit.",
  },
  {
    question: "What makes these proposals different?",
    answer: "Trained on real proposals that closed over $1M in deals. The structure, psychology, and language patterns are battle-tested by consultants who actually win.",
  },
  {
    question: "Can I edit the generated content?",
    answer: "100%. Everything we generate is a starting point. Copy to Google Docs, tweak the details, make it yours. We give you the foundation, you add the finishing touches.",
  },
  {
    question: "Where are my proposals saved?",
    answer: "Auto-saved to your account. Access them anytime from the dropdown above or 'Saved Proposals' in your profile menu.",
  },
];

interface OnboardingTabProps {
  onNewProposal: () => void;
}

export function OnboardingTab({ onNewProposal }: OnboardingTabProps) {
  return (
    <div className="h-full overflow-auto bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Trophy className="h-4 w-4" />
            $1M+ in closed deals
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Getting Started with Pitch Genius
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to create winning proposals.
            Written proposals in 30 seconds. Designer-quality slide decks in under 7 minutes.
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center mb-12">
          <Button onClick={onNewProposal} size="lg" className="text-base px-8 bg-primary hover:bg-primary/90">
            <Zap className="mr-2 h-5 w-5" />
            Create New Proposal
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* What You Get - With Timing */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">
            Your Complete Proposal Suite
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {deliverables.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`relative flex flex-col items-center gap-2 rounded-xl p-4 text-center ${
                    item.premium 
                      ? "bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200" 
                      : "bg-white border border-slate-200"
                  }`}
                >
                  {item.premium && (
                    <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      PREMIUM
                    </div>
                  )}
                  <div className={`rounded-full p-2.5 ${item.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item.title}</span>
                  <span className={`text-xs font-medium ${item.premium ? "text-purple-600" : "text-slate-500"}`}>
                    {item.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* The Slide Deck Pitch - Main Marketing Block */}
        <div className="mb-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-purple-500 p-2.5">
                <Presentation className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">About Those Slide Decks...</h3>
            </div>
            
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              Real talk: Our AI designer takes <span className="text-white font-semibold">5+ minutes</span> per deck. 
              Why? Because we're not slapping your content onto a template and calling it a day. 
              We're building <span className="text-purple-400 font-semibold">bespoke, million-dollar presentations</span> that 
              actually close deals.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl bg-white/10 backdrop-blur p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="font-semibold text-sm">Premium AI Models</span>
                </div>
                <p className="text-xs text-slate-400">The same tech powering top creative agencies. Not some bargain-bin AI.</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="font-semibold text-sm">Proven Layouts</span>
                </div>
                <p className="text-xs text-slate-400">Structures that have won real contracts. Psychology-backed design.</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="font-semibold text-sm">Ready to Send</span>
                </div>
                <p className="text-xs text-slate-400">Download as PDF. No editing needed. Just send and close.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <Coffee className="h-8 w-8 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-white">Go grab a coffee. Seriously.</p>
                <p className="text-sm text-slate-400">
                  Hit generate, take a break, come back to a presentation that'll make your competitors jealous.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick How It Works */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">The Process</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 rounded-xl bg-white border border-slate-200 p-5 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold mb-3">1</div>
              <h3 className="font-semibold text-slate-900 mb-1">Paste Context</h3>
              <p className="text-sm text-slate-600">Drop your client notes, call transcripts, or project details.</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-500">
                <Timer className="h-3 w-3" />
                30 seconds
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center text-slate-300">
              <ArrowRight className="h-6 w-6" />
            </div>
            <div className="flex-1 rounded-xl bg-white border border-slate-200 p-5 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold mb-3">2</div>
              <h3 className="font-semibold text-slate-900 mb-1">Get Your Proposal</h3>
              <p className="text-sm text-slate-600">Written proposal streams in real-time. Copy, tweak, send.</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-500">
                <Timer className="h-3 w-3" />
                ~30 seconds
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center text-slate-300">
              <ArrowRight className="h-6 w-6" />
            </div>
            <div className="flex-1 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-5 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500 text-white font-bold mb-3">3</div>
              <h3 className="font-semibold text-slate-900 mb-1">Generate the Deck</h3>
              <p className="text-sm text-slate-600">Our AI designer builds your presentation. Take a break.</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-purple-600 font-medium">
                <Coffee className="h-3 w-3" />
                5+ min (worth it)
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-900">Quick Answers</h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="border-slate-200"
                >
                  <AccordionTrigger className="px-5 py-4 text-left text-slate-900 hover:no-underline hover:bg-slate-50 text-sm font-medium">
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
          <p className="text-slate-500 text-sm mb-3">First time? Set up your profile for personalized proposals.</p>
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
