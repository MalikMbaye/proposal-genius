import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Lock,
  FileText,
  ArrowRight,
  DollarSign,
  Building2,
  BarChart3,
  CheckCircle,
  Smartphone,
  TrendingUp,
  Palette,
  Handshake,
  Presentation,
  Play,
  ChevronDown,
  ChevronRight,
  Star,
  Shield,
  Clock,
  Users,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Deep Emerald/Green theme
const theme = {
  bgPrimary: "bg-[#0A1A14]",
  bgSecondary: "bg-[#0F2920]",
  bgCard: "bg-[#132B22]",
  accent: "text-emerald-400",
  accentBg: "bg-emerald-500",
  border: "border-[#1F3D32]",
};

const stats = [
  { value: "50+", label: "Real Proposals", icon: FileText },
  { value: "$1.5M+", label: "In Closed Deals", icon: DollarSign },
  { value: "12", label: "Industries", icon: Building2 },
  { value: "$2K-$200K", label: "Deal Range", icon: BarChart3 },
  { value: "85%+", label: "Win Rate", icon: CheckCircle },
];

const modules = [
  {
    title: "App Development & Product Builds",
    subtitle: "Full-stack proposals for mobile apps, web apps, and digital products",
    icon: Smartphone,
    proposalCount: 6,
    sampleProposals: [
      { title: "Mobile App — E-commerce + Community Platform", dealSize: "$160K" },
      { title: "Fitness App — Workout Programs + Shopify", dealSize: "$20-30K" },
      { title: "AI Automation Agent — Job Application System", dealSize: "$10-20K" },
    ]
  },
  {
    title: "Growth Marketing & Customer Acquisition",
    subtitle: "Proposals for scaling revenue, content systems, and paid media",
    icon: TrendingUp,
    proposalCount: 5,
    sampleProposals: [
      { title: "AI Content System — 100M+ Views Campaign", dealSize: "$10K" },
      { title: "Chrome Extension Growth Strategy", dealSize: "$9K" },
      { title: "E-Commerce Partnership — 12-Week Program", dealSize: "$10K" },
    ]
  },
  {
    title: "B2B SaaS & Enterprise",
    subtitle: "Complex proposals for software companies and enterprise clients",
    icon: Building2,
    proposalCount: 4,
    sampleProposals: [
      { title: "GTM & Sales Support — AI Course Platform", dealSize: "£2K/mo" },
      { title: "Growth Operating Partner — Profit Share", dealSize: "$15K + 20%" },
      { title: "HR Tech Growth — VC Portfolio Company", dealSize: "$20-30K" },
    ]
  },
  {
    title: "Brand Development & Launch Strategy",
    subtitle: "Branding, positioning, pre-launch, and market validation",
    icon: Palette,
    proposalCount: 4,
    sampleProposals: [
      { title: "Pre-Launch Strategy — Supplement Brand", dealSize: "$3-10K" },
      { title: "Full Rebrand — DTC Consumer Brand", dealSize: "$15K" },
      { title: "Launch Kit — Wellness Brand GTM", dealSize: "$8K" },
    ]
  },
  {
    title: "Fractional & Retainer Partnerships",
    subtitle: "Ongoing advisory, profit share, and operating partner structures",
    icon: Handshake,
    proposalCount: 3,
    sampleProposals: [
      { title: "Growth Operating Partner Template", dealSize: "Profit Share" },
      { title: "Fractional CMO — Agency Partnership", dealSize: "$5K/mo" },
      { title: "Equity Advisory — Early-Stage Startup", dealSize: "2% Equity" },
    ]
  },
  {
    title: "Pitch Decks & Fundraising Support",
    subtitle: "Investor materials that helped raise $50M+",
    icon: Presentation,
    proposalCount: 4,
    sampleProposals: [
      { title: "Seed Round Deck — Accelerator-Backed", dealSize: "$2M Raised" },
      { title: "Series A Deck — Major VC Firm", dealSize: "$10M Raised" },
      { title: "Angel Round Deck — Consumer App", dealSize: "$500K Raised" },
    ]
  },
];

const testimonials = [
  {
    quote: "I landed a $45K contract using the SaaS proposal template. The structure alone was worth 10x the price.",
    author: "Sarah M.",
    role: "Freelance Developer",
    result: "$45K contract"
  },
  {
    quote: "Finally understand how to price high-ticket projects. Went from $5K to $25K proposals overnight.",
    author: "James L.",
    role: "Marketing Consultant",
    result: "5x pricing increase"
  },
  {
    quote: "The redacted proposals show exactly what works. No fluff, just battle-tested frameworks.",
    author: "Alex R.",
    role: "Agency Owner",
    result: "85% close rate"
  },
];

const faqs = [
  {
    question: "What exactly do I get?",
    answer: "Instant access to 50+ real proposals that closed deals ranging from $2K to $200K+, organized by industry and deal type. Every proposal includes the actual structure, pricing, and positioning that worked."
  },
  {
    question: "Are these real proposals?",
    answer: "Yes. Every single proposal in the library was used to close an actual deal. Client details are redacted, but the structure, pricing, and strategy are 100% real."
  },
  {
    question: "How is this different from templates?",
    answer: "Templates are theory. These are battle-tested proposals that actually won contracts. You'll see exactly what worked, including the pricing, scope structure, and positioning that commanded premium rates."
  },
  {
    question: "What industries are covered?",
    answer: "Technology, SaaS, marketing, consulting, design, development, strategy, and more. The principles work across industries—it's the positioning and structure that matters."
  },
];

export function ProposalLibraryTab() {
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const handleUnlock = () => {
    navigate("/library");
  };

  const scrollToModules = () => {
    document.getElementById('modules-preview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-full overflow-auto ${theme.bgPrimary}`}>
      {/* HERO SECTION */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Premium Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${theme.bgCard} border ${theme.border}`}>
            <Lock className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-widest uppercase text-emerald-400">
              PREMIUM ACCESS
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white">
            From $250 to $250K:
            <br />
            <span className="text-emerald-400">The Proposal Library</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Stop guessing what works. Get instant access to 50+ real proposals from contracts that actually closed—and the strategy behind each one.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-12">
            {stats.map((stat) => (
              <Card 
                key={stat.label}
                className={`p-4 md:p-6 text-center ${theme.bgCard} border ${theme.border} hover:border-emerald-500/30 transition-colors`}
              >
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-emerald-400 opacity-70" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleUnlock}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
            >
              <Lock className="mr-2 h-5 w-5" />
              Unlock Full Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={scrollToModules}
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg font-semibold rounded-xl"
            >
              <Play className="mr-2 h-5 w-5" />
              See What's Inside
            </Button>
          </div>
        </div>
      </section>

      {/* THE QUESTION SECTION */}
      <section className={`py-16 ${theme.bgSecondary}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">
            THE QUESTION
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            "How do I know what to charge?"
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            You've asked it. Every freelancer has. The answer isn't a pricing calculator—it's seeing what others actually charged and won. That's what this library gives you.
          </p>
        </div>
      </section>

      {/* MODULES PREVIEW SECTION */}
      <section id="modules-preview" className={`py-16 md:py-24 px-6 ${theme.bgPrimary}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">
              WHAT'S INSIDE
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              6 Modules. 50+ Real Proposals.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Organized by industry and deal type so you can find exactly what you need.
            </p>
          </div>

          {/* Module Cards */}
          <div className="space-y-4">
            {modules.map((module, index) => {
              const Icon = module.icon;
              const isExpanded = expandedModule === module.title;
              
              return (
                <Card 
                  key={module.title}
                  className={`${theme.bgCard} border ${theme.border} overflow-hidden transition-all hover:border-emerald-500/30`}
                >
                  <button
                    onClick={() => setExpandedModule(isExpanded ? null : module.title)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${theme.bgSecondary}`}>
                        <Icon className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">
                          {module.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {module.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500 hidden sm:block">
                        {module.proposalCount} proposals
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-500" />
                      )}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className={`px-5 pb-5 border-t ${theme.border}`}>
                      <div className="pt-4 space-y-2">
                        {module.sampleProposals.map((proposal, pIndex) => (
                          <div 
                            key={pIndex}
                            className={`flex items-center justify-between p-3 rounded-lg ${theme.bgSecondary} group`}
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-slate-500" />
                              <span className="text-sm text-slate-300">
                                {proposal.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                {proposal.dealSize}
                              </span>
                              <Lock className="h-4 w-4 text-slate-600" />
                            </div>
                          </div>
                        ))}
                        <p className="text-xs text-slate-600 text-center pt-2">
                          + {module.proposalCount - 3} more proposals in this module
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* CTA after modules */}
          <div className="text-center mt-12">
            <Button
              onClick={handleUnlock}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/20"
            >
              <Lock className="mr-2 h-5 w-5" />
              Unlock All 50+ Proposals
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className={`py-16 ${theme.bgSecondary}`}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">
              RESULTS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What happens when you stop guessing
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className={`p-6 ${theme.bgCard} border ${theme.border}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white text-sm">{testimonial.author}</p>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    {testimonial.result}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WHY THIS WORKS SECTION */}
      <section className={`py-16 md:py-24 px-6 ${theme.bgPrimary}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">
              WHY IT WORKS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Real proposals. Real results.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Battle-Tested",
                description: "Every proposal closed a real deal. No theory, no fluff—just what actually worked."
              },
              {
                icon: Zap,
                title: "Instantly Applicable",
                description: "Copy the structure, adapt the language, close your own deals faster."
              },
              {
                icon: Clock,
                title: "Hours Saved",
                description: "Stop starting from scratch. Use proven frameworks that command premium rates."
              },
            ].map((feature, index) => (
              <Card 
                key={index}
                className={`p-6 text-center ${theme.bgCard} border ${theme.border}`}
              >
                <div className={`inline-flex p-3 rounded-lg ${theme.bgSecondary} mb-4`}>
                  <feature.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className={`py-16 ${theme.bgSecondary}`}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Common Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`}
                className={`${theme.bgCard} border ${theme.border} rounded-lg px-6 overflow-hidden`}
              >
                <AccordionTrigger className="text-white hover:text-emerald-400 text-left py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className={`py-20 md:py-28 px-6 ${theme.bgPrimary}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to close bigger deals?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Join freelancers, consultants, and agencies who've used these proposals to command premium rates.
          </p>
          
          <Button
            onClick={handleUnlock}
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-7 text-xl font-semibold rounded-xl shadow-xl shadow-emerald-500/25 transition-all hover:-translate-y-1"
          >
            <Lock className="mr-3 h-6 w-6" />
            Unlock The Proposal Library
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          
          <p className="text-sm text-slate-600 mt-6">
            One-time purchase. Lifetime access. No recurring fees.
          </p>
        </div>
      </section>
    </div>
  );
}
