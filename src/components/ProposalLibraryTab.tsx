import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Lock,
  FileText,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  DollarSign,
  BookOpen,
  Users,
  Lightbulb,
  ChevronDown,
  Shield,
  Zap,
  Clock,
  Star,
  Play,
  Mail,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Color system - Deep Emerald/Green palette
const colors = {
  bgPrimary: "#0A1A14",
  bgSecondary: "#0F2920",
  cardBg: "#132B22",
  accent: "#10B981",
  accentLight: "#34D399",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  border: "#1F3D32",
  success: "#22C55E",
  warning: "#F59E0B",
};

const masterclassModules = [
  { number: 1, title: "The Psychology of Premium Pricing", duration: "25 min", description: "Why clients pay 10x more for the same work" },
  { number: 2, title: "Positioning That Commands Authority", duration: "30 min", description: "How to become the obvious choice" },
  { number: 3, title: "The Proposal Structure That Wins", duration: "20 min", description: "Template breakdown with real examples" },
  { number: 4, title: "Objection Handling Masterclass", duration: "25 min", description: "Never lose a deal to price again" },
  { number: 5, title: "Follow-Up Sequences That Close", duration: "20 min", description: "Email templates that convert" },
  { number: 6, title: "Scaling to $500K+ Annually", duration: "20 min", description: "Systems for consistent high-ticket wins" },
];

const faqs = [
  {
    question: "What exactly do I get?",
    answer: "You get instant access to 50+ real proposals that closed deals ranging from $25K to $300K+, a 3-hour strategic positioning masterclass, email templates, and lifetime updates whenever we add new proposals."
  },
  {
    question: "Are these real proposals?",
    answer: "Yes. Every single proposal in the library was used to close an actual deal. We've anonymized client details where necessary, but the structure, pricing, and strategy are 100% real."
  },
  {
    question: "How is this different from templates online?",
    answer: "Templates are theory. These are battle-tested proposals that actually won contracts. You'll see exactly what worked, including the pricing, scope structure, and positioning that commanded premium rates."
  },
  {
    question: "What industries are covered?",
    answer: "Technology, SaaS, marketing, consulting, design, development, strategy, and more. The principles work across industries—it's the positioning and structure that matters."
  },
  {
    question: "Is there a refund policy?",
    answer: "Due to the digital nature of the content, we don't offer refunds. However, we're confident this will pay for itself with your very first proposal improvement."
  },
];

export function ProposalLibraryTab() {
  const handleUnlock = () => {
    window.open("https://buy.stripe.com/your-link", "_blank");
  };

  return (
    <div className="min-h-full overflow-auto" style={{ backgroundColor: colors.bgPrimary }}>
      {/* SECTION 1: HERO */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Premium Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ 
              backgroundColor: `${colors.accent}1A`,
              border: `1px solid ${colors.accent}4D`
            }}
          >
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: colors.accent }}>
              🔓 PREMIUM ACCESS
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{ color: colors.textPrimary }}
          >
            From $250 to $250K:
            <br />
            <span style={{ color: colors.accent }}>The Proposal Library</span>
          </h1>
          
          {/* Sub-headline */}
          <p 
            className="text-xl max-w-2xl mx-auto mb-12"
            style={{ color: colors.textSecondary }}
          >
            Stop guessing what works. Get instant access to 50+ real proposals from contracts that actually closed—and the strategy behind each one.
          </p>
          
          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { number: "50+", label: "Real Proposals" },
              { number: "$1M+", label: "In Closed Deals" },
              { number: "3hrs", label: "Masterclass Included" },
            ].map((stat) => (
              <div 
                key={stat.label}
                className="p-6 rounded-lg text-center"
                style={{ 
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                  {stat.number}
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-10 py-6 font-semibold rounded-xl transition-all hover:-translate-y-0.5"
              style={{ 
                backgroundColor: colors.accent,
                color: colors.textPrimary,
                boxShadow: `0 10px 40px ${colors.accent}33`
              }}
            >
              <Lock className="mr-2 h-5 w-5" />
              Unlock Full Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-10 py-6 font-semibold rounded-xl transition-all hover:bg-emerald-500/10"
              style={{ 
                borderColor: colors.accent,
                color: colors.textPrimary,
                borderWidth: 2
              }}
            >
              <Play className="mr-2 h-5 w-5" />
              See What's Inside
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 2: STORY HOOK */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.bgSecondary }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: colors.accent }}>
            THE QUESTION
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: colors.textPrimary }}>
            "How do I know what to charge?"
          </h2>
          
          <p className="text-lg leading-relaxed" style={{ color: colors.textSecondary }}>
            I asked myself this question for years. My first proposal was for <strong style={{ color: colors.textPrimary }}>$250</strong>. 
            I thought I was asking for a lot. Then I watched colleagues close deals at <strong style={{ color: colors.textPrimary }}>$5K</strong>... 
            then <strong style={{ color: colors.textPrimary }}>$25K</strong>... then <strong style={{ color: colors.textPrimary }}>$100K+</strong>—for similar work.
          </p>
        </div>
      </section>

      {/* SECTION 3: THE JOURNEY */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Left Column */}
            <div className="md:col-span-3">
              <p className="text-lg leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
                The difference wasn't skill. It wasn't experience. It wasn't even the work itself.
              </p>
              <p className="text-lg leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
                The difference was <strong style={{ color: colors.textPrimary }}>how they positioned and presented</strong> their work. 
                The proposal itself was doing the heavy lifting.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Same skills, 10x different outcomes",
                  "Same deliverables, completely different pricing",
                  "Same clients, opposite perceptions of value"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base" style={{ color: colors.textSecondary }}>
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Right Column - Breakthrough Card */}
            <div 
              className="md:col-span-2 p-8 rounded-2xl"
              style={{ 
                backgroundColor: colors.cardBg,
                border: `2px solid ${colors.accent}33`,
                boxShadow: `0 20px 60px ${colors.accent}1A`
              }}
            >
              <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: colors.accent }}>
                THE BREAKTHROUGH
              </span>
              <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
                I spent 2 years collecting proposals from top performers. I asked a simple question:
              </p>
              <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                "Can I see the proposal you used to close that deal?"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE THREE FACTORS */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.bgSecondary }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: colors.accent }}>
              THE THREE FACTORS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: colors.textPrimary }}>
              What separates $10K from $100K projects
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Target,
                title: "Strategic Positioning",
                body: "How you frame the problem determines what you can charge for the solution.",
                bullets: ["Reframe from 'task' to 'transformation'", "Position yourself as the guide, not the vendor", "Create urgency without manipulation"]
              },
              {
                icon: DollarSign,
                title: "Value Anchoring",
                body: "The number you present first shapes every number that follows.",
                bullets: ["Lead with outcomes, not deliverables", "Use strategic price architecture", "Make your fee the obvious choice"]
              },
              {
                icon: Lightbulb,
                title: "Psychological Triggers",
                body: "Certain phrases and structures trigger trust and action.",
                bullets: ["Authority signals that work", "Risk-reversal language", "Future-pacing techniques"]
              }
            ].map((factor) => {
              const Icon = factor.icon;
              return (
                <div 
                  key={factor.title}
                  className="p-8 rounded-xl transition-all hover:-translate-y-1 hover:border-amber-500/40"
                  style={{ 
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <Icon className="h-8 w-8 mb-4" style={{ color: colors.accent }} />
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                    {factor.title}
                  </h3>
                  <p className="text-base mb-4" style={{ color: colors.textSecondary }}>
                    {factor.body}
                  </p>
                  <ul className="space-y-2">
                    {factor.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm" style={{ color: colors.textSecondary }}>
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          
          {/* Pull Quote */}
          <div className="max-w-3xl mx-auto pl-6" style={{ borderLeft: `4px solid ${colors.accent}` }}>
            <p className="text-xl md:text-2xl italic" style={{ color: colors.textPrimary }}>
              "The proposal isn't a summary of your work. It's a sales document that should close the deal before the call even happens."
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: CREDIBILITY */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                Where These Proposals Come From
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: colors.textSecondary }}>
                These aren't theoretical templates. They're real proposals used by consultants working with companies like{" "}
                <strong style={{ color: colors.textPrimary }}>Apple</strong>,{" "}
                <strong style={{ color: colors.textPrimary }}>Google</strong>, and Fortune 500 enterprises—as well as funded startups and growing agencies.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                What You'll Learn
              </h3>
              <ul className="space-y-3">
                {[
                  "How to structure proposals that command premium pricing",
                  "The exact language that creates urgency",
                  "Pricing psychology that justifies higher rates",
                  "Follow-up sequences that close deals"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3" style={{ color: colors.textSecondary }}>
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: colors.success }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: THE PROBLEM */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.bgSecondary }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto" style={{ color: colors.textPrimary }}>
              The $200K difference no one talks about
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Most Consultants */}
            <div 
              className="p-8 rounded-xl"
              style={{ 
                backgroundColor: colors.cardBg,
                borderLeft: `4px solid #EF4444`
              }}
            >
              <h4 className="text-lg font-bold mb-6" style={{ color: colors.textPrimary }}>
                Most Consultants
              </h4>
              <div className="space-y-4">
                <div>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Proposals sent/year:</span>
                  <span className="block text-2xl font-bold" style={{ color: colors.textPrimary }}>50+</span>
                </div>
                <div>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Average project:</span>
                  <span className="block text-2xl font-bold" style={{ color: colors.textPrimary }}>$3-5K</span>
                </div>
                <div>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Annual revenue:</span>
                  <span className="block text-3xl font-bold" style={{ color: "#EF4444" }}>~$75K</span>
                </div>
                <div className="pt-4">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Strategy: "Send more proposals, lower prices to compete"
                  </span>
                </div>
              </div>
            </div>
            
            {/* Top Consultants */}
            <div 
              className="p-8 rounded-xl"
              style={{ 
                backgroundColor: colors.cardBg,
                borderLeft: `4px solid ${colors.success}`
              }}
            >
              <h4 className="text-lg font-bold mb-6" style={{ color: colors.textPrimary }}>
                Top Consultants
              </h4>
              <div className="space-y-4">
                <div>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Proposals sent/year:</span>
                  <span className="block text-2xl font-bold" style={{ color: colors.textPrimary }}>12-15</span>
                </div>
                <div>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Average project:</span>
                  <span className="block text-2xl font-bold" style={{ color: colors.textPrimary }}>$25-50K</span>
                </div>
                <div>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>Annual revenue:</span>
                  <span className="block text-3xl font-bold" style={{ color: colors.success }}>$300K+</span>
                </div>
                <div className="pt-4">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Strategy: "Position strategically, charge premium"
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Big Number */}
          <div className="text-center">
            <span className="text-5xl md:text-7xl font-bold" style={{ color: colors.accent }}>
              $200K difference
            </span>
            <p className="text-lg mt-2" style={{ color: colors.textSecondary }}>
              Every single year.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: THE EPIPHANY */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg leading-relaxed mb-8" style={{ color: colors.textSecondary }}>
              I'll never forget the moment it clicked. A colleague showed me a proposal they'd used to close a{" "}
              <strong style={{ color: colors.textPrimary }}>$200K deal</strong>—for work I had quoted at{" "}
              <strong style={{ color: colors.accent }}>$5K</strong>.
            </p>
          </div>
          
          {/* Comparison Box */}
          <div 
            className="p-8 rounded-2xl"
            style={{ backgroundColor: colors.cardBg }}
          >
            <div className="grid md:grid-cols-2 gap-8 relative">
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: colors.textSecondary }}>
                  WHAT MOST PEOPLE SAY
                </span>
                <p className="text-base italic" style={{ color: colors.textSecondary }}>
                  "We'll build you a website. It'll take 4 weeks and cost $5,000."
                </p>
              </div>
              
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <ArrowRight className="h-8 w-8" style={{ color: colors.accent }} />
              </div>
              
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: colors.accent }}>
                  WHAT WINNERS SAY
                </span>
                <p className="text-base" style={{ color: colors.textPrimary }}>
                  "We'll architect a digital platform that positions your brand as the market leader, 
                  drives qualified leads on autopilot, and becomes your most valuable sales asset. 
                  <strong> This is a $2M revenue opportunity.</strong>"
                </p>
              </div>
            </div>
          </div>
          
          {/* Pull Quote */}
          <div className="text-center mt-12">
            <p className="text-xl md:text-2xl italic max-w-2xl mx-auto" style={{ color: colors.textPrimary }}>
              Same work. Different frame. <span style={{ color: colors.accent }}>40x the price.</span>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: SOLUTION (MAIN OFFER) */}
      <section id="solution" className="py-20 px-6" style={{ backgroundColor: colors.bgSecondary }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: colors.accent }}>
              WHAT YOU GET
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              The Complete Proposal Library
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
              Everything you need to close bigger deals, command premium pricing, and never wonder "what to charge" again.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: FileText,
                title: "50+ Real Proposals",
                description: "Actual proposals used to close deals from $25K to $300K+",
                label: "What you'll see:",
                bullets: ["Full proposal documents", "Pricing breakdowns", "Scope structures", "Follow-up emails", "Winning cover letters"]
              },
              {
                icon: Trophy,
                title: "$1M+ in Closed Deals",
                description: "Battle-tested templates from real winning contracts",
                label: "What you'll learn:",
                bullets: ["What made each proposal work", "Key phrases that triggered action", "Pricing strategies used", "How objections were handled"]
              },
              {
                icon: TrendingUp,
                title: "Pricing Strategies That Work",
                description: "See exactly how top performers price their services",
                label: "You'll understand:",
                bullets: ["Value-based pricing in action", "How to anchor high", "Package and tier structures", "When to discount (and when not to)"]
              },
              {
                icon: BookOpen,
                title: "3-Hour Strategic Masterclass",
                description: "Deep-dive training on positioning and pricing",
                label: "You'll master:",
                bullets: ["Psychology of premium pricing", "Authority positioning", "Objection handling", "Follow-up systems"]
              },
              {
                icon: Users,
                title: "Private Community Access",
                description: "Get your proposals reviewed by peers and experts",
                label: "Community benefits:",
                bullets: ["Async proposal reviews", "Feedback from top consultants", "Share wins and learn from losses", "Network with high-performers"]
              }
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="p-8 rounded-xl transition-all hover:-translate-y-1 hover:border-emerald-500/40"
                  style={{ 
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <Icon className="h-10 w-10 mb-4" style={{ color: colors.accent }} />
                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                    {feature.title}
                  </h3>
                  <p className="text-base mb-4" style={{ color: colors.textSecondary }}>
                    {feature.description}
                  </p>
                  <span className="text-sm font-semibold mb-2 block" style={{ color: colors.accent }}>
                    {feature.label}
                  </span>
                  <ul className="space-y-1">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: colors.success }} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9: MASTERCLASS BREAKDOWN */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: colors.accent }}>
              BONUS INCLUDED
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: colors.textPrimary }}>
              Strategic Positioning Masterclass
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {masterclassModules.map((module) => (
              <div 
                key={module.number}
                className="p-6 rounded-lg"
                style={{ 
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`
                }}
              >
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{ backgroundColor: `${colors.accent}33`, color: colors.accent }}
                >
                  Module {module.number}
                </span>
                <h4 className="text-lg font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  {module.title}
                </h4>
                <span className="text-sm mb-2 block" style={{ color: colors.textSecondary }}>
                  ({module.duration})
                </span>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {module.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: SOCIAL PROOF */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.bgSecondary }}>
        <div className="max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div 
            className="p-12 rounded-2xl text-center mb-12"
            style={{ 
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.accent}4D`
            }}
          >
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-amber-400" style={{ color: colors.accent }} />
              ))}
            </div>
            <p className="text-xl italic mb-6" style={{ color: colors.textPrimary }}>
              "I used the proposal templates and closed my first $50K project within 3 weeks. 
              The ROI was insane. This should cost 10x what it does."
            </p>
            <p className="font-bold" style={{ color: colors.accent }}>
              — Sarah T., Strategy Consultant
            </p>
          </div>
          
          {/* Results Table */}
          <div 
            className="rounded-xl overflow-hidden"
            style={{ border: `1px solid ${colors.border}` }}
          >
            <div className="grid grid-cols-2">
              <div className="p-6 text-center" style={{ backgroundColor: colors.cardBg, borderRight: `1px solid ${colors.border}` }}>
                <span className="text-lg font-bold block mb-4" style={{ color: "#EF4444" }}>BEFORE</span>
                <div className="space-y-3">
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Average project: <strong style={{ color: colors.textPrimary }}>$3K</strong></p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Close rate: <strong style={{ color: colors.textPrimary }}>15%</strong></p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Confidence: <strong style={{ color: colors.textPrimary }}>Low</strong></p>
                </div>
              </div>
              <div className="p-6 text-center" style={{ backgroundColor: colors.cardBg }}>
                <span className="text-lg font-bold block mb-4" style={{ color: colors.success }}>AFTER</span>
                <div className="space-y-3">
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Average project: <strong style={{ color: colors.textPrimary }}>$35K</strong></p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Close rate: <strong style={{ color: colors.textPrimary }}>45%</strong></p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Confidence: <strong style={{ color: colors.textPrimary }}>Unshakeable</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: PRICING */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-xl mx-auto">
          <div 
            className="p-12 rounded-2xl text-center"
            style={{ 
              backgroundColor: colors.cardBg,
              border: `2px solid ${colors.accent}4D`,
              boxShadow: `0 20px 60px ${colors.accent}1A`
            }}
          >
            <span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ backgroundColor: `${colors.accent}33`, color: colors.accent }}
            >
              <Sparkles className="h-4 w-4" />
              Lifetime Access
            </span>
            
            <div className="mb-6">
              <span className="text-6xl md:text-7xl font-bold" style={{ color: colors.textPrimary }}>
                $497
              </span>
              <span className="block text-sm mt-2" style={{ color: colors.textSecondary }}>
                one-time payment
              </span>
            </div>
            
            <div className="w-full h-px mb-6" style={{ backgroundColor: colors.border }} />
            
            <span className="text-sm font-semibold mb-4 block" style={{ color: colors.accent }}>
              What's Included:
            </span>
            
            <ul className="space-y-3 mb-8 text-left max-w-sm mx-auto">
              {[
                "50+ real proposal templates",
                "3-hour strategic positioning masterclass",
                "Email follow-up sequences",
                "Pricing strategy breakdowns",
                "Lifetime access + updates",
                "Private community for proposal reviews"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3" style={{ color: colors.textSecondary }}>
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: colors.success }} />
                  {item}
                </li>
              ))}
            </ul>
            
            <Button 
              onClick={handleUnlock}
              className="w-full text-lg py-6 font-semibold rounded-xl transition-all hover:-translate-y-0.5"
              style={{ 
                backgroundColor: colors.accent,
                color: colors.textPrimary,
                boxShadow: `0 10px 40px ${colors.accent}33`
              }}
            >
              <Lock className="mr-2 h-5 w-5" />
              Unlock Full Access Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="text-sm mt-4" style={{ color: colors.textSecondary }}>
              Secure payment via Stripe. Instant access after purchase.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 12: FAQ */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.bgSecondary }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: colors.textPrimary }}>
              Questions? We've got answers.
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="rounded-lg px-6"
                style={{ 
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`
                }}
              >
                <AccordionTrigger 
                  className="text-left font-semibold py-6 hover:no-underline"
                  style={{ color: colors.textPrimary }}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent 
                  className="pb-6 text-base leading-relaxed"
                  style={{ color: colors.textSecondary }}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* SECTION 13: URGENCY */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Every week you wait...",
                body: "...is another proposal sent at the wrong price. Another deal left on the table."
              },
              {
                icon: DollarSign,
                title: "Your next proposal",
                body: "Could be worth $10K more with the right positioning. That's 20x the cost of this library."
              },
              {
                icon: Zap,
                title: "Instant access",
                body: "Start using these templates today. Close your first upgraded deal this month."
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.title}
                  className="p-8 rounded-xl text-center"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <Icon className="h-8 w-8 mx-auto mb-4" style={{ color: colors.accent }} />
                  <h4 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                    {item.title}
                  </h4>
                  <p className="text-base" style={{ color: colors.textSecondary }}>
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 14: FINAL CTA */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: colors.bgSecondary }}>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.accent}15` }}
        />
        
        <div className="max-w-3xl mx-auto text-center relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: colors.accent }}>
            READY?
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: colors.textPrimary }}>
            Stop leaving money on the table.
          </h2>
          
          <ul className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            {[
              "50+ winning proposals",
              "3-hour masterclass",
              "Lifetime access"
            ].map((item) => (
              <li key={item} className="flex items-center justify-center gap-2 text-lg" style={{ color: colors.textSecondary }}>
                <CheckCircle2 className="h-5 w-5" style={{ color: colors.success }} />
                {item}
              </li>
            ))}
          </ul>
          
          <p className="text-xl italic mb-10 max-w-2xl mx-auto" style={{ color: colors.textPrimary }}>
            "The difference between a $5K proposal and a $50K proposal isn't the work—
            <span style={{ color: colors.accent }}> it's the positioning.</span>"
          </p>
          
          <Button 
            onClick={handleUnlock}
            className="text-xl px-12 py-7 font-semibold rounded-xl transition-all hover:-translate-y-1"
            style={{ 
              backgroundColor: colors.accent,
              color: colors.textPrimary,
              boxShadow: `0 15px 50px ${colors.accent}40`
            }}
          >
            <Lock className="mr-2 h-6 w-6" />
            Get Instant Access — $497
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
          
          <p className="text-sm mt-6" style={{ color: colors.textSecondary }}>
            Secure checkout • Instant delivery • Lifetime access
          </p>
        </div>
      </section>

      {/* SECTION 15: P.S. */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto space-y-6" style={{ color: colors.textSecondary }}>
          <p className="text-base leading-relaxed">
            <strong style={{ color: colors.textPrimary }}>P.S.</strong> — If you're still reading, you know something needs to change. 
            Your skills aren't the problem. Your pricing is.
          </p>
          <p className="text-base leading-relaxed">
            <strong style={{ color: colors.textPrimary }}>P.P.S.</strong> — Every proposal you send at the wrong price is money you'll never get back. 
            The library pays for itself with a single improved proposal.
          </p>
          <p className="text-base leading-relaxed">
            <strong style={{ color: colors.textPrimary }}>P.P.P.S.</strong> — Questions? Reach out at{" "}
            <a href="mailto:hello@example.com" className="underline" style={{ color: colors.accent }}>
              hello@example.com
            </a>. 
            I read every message.
          </p>
        </div>
      </section>

      {/* SECTION 16: FOOTER */}
      <footer className="py-12 px-6" style={{ borderTop: `1px solid ${colors.border}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { icon: Shield, label: "Secure Payment" },
              { icon: Zap, label: "Instant Access" },
              { icon: Sparkles, label: "Lifetime Updates" },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                  <Icon className="h-4 w-4" />
                  {badge.label}
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <a 
              href="mailto:hello@example.com" 
              className="text-sm underline mb-4 block"
              style={{ color: colors.textSecondary }}
            >
              hello@example.com
            </a>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              <a href="#" className="underline">Privacy Policy</a> • <a href="#" className="underline">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
