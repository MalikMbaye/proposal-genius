import { Button } from "@/components/ui/button";
import {
  Library,
  Lock,
  FileText,
  Trophy,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  DollarSign,
  Briefcase,
  Target,
  TrendingUp,
} from "lucide-react";

const sampleProposals = [
  { title: "Enterprise SaaS Implementation", value: "$125K", industry: "Technology", blurred: true },
  { title: "Brand Strategy & Identity", value: "$85K", industry: "Marketing", blurred: true },
  { title: "Digital Transformation Roadmap", value: "$200K", industry: "Consulting", blurred: true },
  { title: "E-commerce Platform Build", value: "$95K", industry: "Retail", blurred: true },
  { title: "AI Integration Strategy", value: "$150K", industry: "Technology", blurred: true },
  { title: "Go-to-Market Launch", value: "$75K", industry: "Startup", blurred: true },
];

const libraryFeatures = [
  { icon: FileText, title: "50+ Real Proposals", description: "Actual proposals that closed deals" },
  { icon: Trophy, title: "$1M+ in Wins", description: "From contracts that actually won" },
  { icon: Target, title: "Multiple Industries", description: "Tech, consulting, marketing & more" },
  { icon: TrendingUp, title: "Pricing Strategies", description: "See how winners price their work" },
];

export function ProposalLibraryTab() {
  const handleUnlock = () => {
    // TODO: Implement payment flow
    window.open("https://buy.stripe.com/your-link", "_blank");
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800 mb-4">
            <Lock className="h-4 w-4" />
            Premium Access
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
            The Proposal Library
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stop guessing what works. Get access to <span className="font-semibold text-slate-900">50+ real proposals</span> from 
            contracts that actually closed. See exactly how top consultants structure, price, and win.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-3xl font-bold text-slate-900">50+</div>
            <div className="text-sm text-slate-600">Real Proposals</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-3xl font-bold text-slate-900">$1M+</div>
            <div className="text-sm text-slate-600">In Closed Deals</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-3xl font-bold text-slate-900">12+</div>
            <div className="text-sm text-slate-600">Industries</div>
          </div>
        </div>

        {/* Blurred Preview Grid */}
        <div className="mb-10 relative">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">
            Preview What's Inside
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sampleProposals.map((proposal, index) => (
              <div
                key={index}
                className="relative rounded-xl bg-white border border-slate-200 p-4 overflow-hidden"
              >
                <div className="absolute inset-0 backdrop-blur-sm bg-white/60 flex items-center justify-center z-10">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 text-sm truncate">{proposal.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-green-600">{proposal.value}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{proposal.industry}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">What You Get</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {libraryFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 p-4 text-center"
                >
                  <div className="rounded-full bg-primary/10 p-2.5">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{feature.title}</span>
                  <span className="text-xs text-slate-500">{feature.description}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing CTA Block */}
        <div className="mb-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
          
          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1.5 text-sm font-medium text-amber-300 mb-4">
              <Sparkles className="h-4 w-4" />
              Lifetime Access
            </div>
            
            <h3 className="text-3xl font-bold mb-2">Unlock the Full Library</h3>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              One payment. Lifetime access. Every proposal we've ever used to close deals.
            </p>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-5xl font-bold">$500</span>
              <span className="text-slate-400 text-lg">one-time</span>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                50+ real proposals
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Lifetime access
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Future updates included
              </div>
            </div>

            <Button 
              onClick={handleUnlock}
              size="lg" 
              className="text-base px-10 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
            >
              <Lock className="mr-2 h-5 w-5" />
              Unlock Full Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="mt-4 text-xs text-slate-400">
              Secure payment via Stripe. Instant access after purchase.
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center pb-8">
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-slate-600 text-sm italic max-w-md mx-auto">
            "Seeing real proposals that won real contracts changed how I price and structure my work. 
            Worth every penny."
          </p>
          <p className="text-slate-500 text-xs mt-2">— Actual customer</p>
        </div>
      </div>
    </div>
  );
}