import { Zap, Clock, Play, FileText, CheckCircle, Lock, Smartphone, TrendingUp, Building2, Palette, Handshake, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Sample modules to show in locked state
const PREVIEW_MODULES = [
  { 
    title: "App Development & Product Builds", 
    subtitle: "Full-stack proposals for mobile apps, web apps, and digital products", 
    count: 6,
    icon: Smartphone
  },
  { 
    title: "Growth Marketing & Customer Acquisition", 
    subtitle: "Proposals for scaling revenue, content systems, and paid media", 
    count: 5,
    icon: TrendingUp
  },
  { 
    title: "B2B SaaS & Enterprise", 
    subtitle: "Complex proposals for software companies and enterprise clients", 
    count: 4,
    icon: Building2
  },
  { 
    title: "Brand Development & Launch Strategy", 
    subtitle: "Branding, positioning, pre-launch, and market validation", 
    count: 4,
    icon: Palette
  },
  { 
    title: "Fractional & Retainer Partnerships", 
    subtitle: "Ongoing advisory, profit share, and operating partner structures", 
    count: 3,
    icon: Handshake
  },
  { 
    title: "Pitch Decks & Fundraising Support", 
    subtitle: "Investor materials that helped raise $50M+", 
    count: 4,
    icon: Presentation
  },
];

const stats = [
  { label: "Deal Value", value: "$1.5M+", icon: Clock },
  { label: "Modules", value: "6", icon: FileText },
  { label: "Proposals", value: "50+", icon: Play },
  { label: "Templates", value: "50+", icon: FileText },
];

const features = [
  { label: "$1.5M+ in deals" },
  { label: "50+ proposals" },
  { label: "50+ templates" },
  { label: "Lifetime access" },
];

export function LibraryUpgradePrompt() {
  const handleUpgrade = () => {
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#pricing";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Badge 
            variant="outline" 
            className="mb-4 gap-1.5 px-3 py-1 text-sm font-medium bg-white text-slate-700 border-slate-200"
          >
            <FileText className="h-3.5 w-3.5" />
            Library
          </Badge>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            The Proposal Library
          </h1>
          <p className="text-slate-600 text-lg">
            Master the art of proposals with 50+ real examples from $1.5M+ in closed deals
          </p>
        </div>

        {/* Progress Card (locked state) */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
              <Lock className="h-6 w-6 text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-slate-900">Your Progress</h3>
                  <p className="text-sm text-slate-500">
                    0 of 50+ proposals reviewed
                  </p>
                </div>
                <span className="text-2xl font-bold text-slate-900">0%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="p-4 text-center rounded-xl border border-slate-200 bg-white"
            >
              <stat.icon className="h-5 w-5 mx-auto mb-2 text-slate-500" />
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section Title */}
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Proposal Modules</h2>

        {/* Preview Modules (locked state) */}
        <div className="space-y-4 mb-8">
          {PREVIEW_MODULES.map((module, i) => {
            const IconComponent = module.icon;
            return (
              <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <IconComponent className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{module.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{module.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-slate-900">0/{module.count}</div>
                    <div className="text-xs text-slate-500">proposals</div>
                  </div>
                </div>
                {/* Locked indicator */}
                <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-500">{module.count} proposals locked</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upgrade CTA Card */}
        <div className="p-8 rounded-xl border border-slate-200 bg-slate-100/50 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center">
              <Zap className="h-7 w-7 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Unlock the Full Library
          </h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Get lifetime access to all 50+ proposals, templates, and expert annotations.
          </p>

          {/* Price */}
          <div className="flex items-baseline justify-center gap-2 mb-6">
            <span className="text-4xl font-bold text-slate-900">$497</span>
            <span className="text-xl text-slate-400 line-through">$997</span>
            <Badge className="ml-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">50% Off</Badge>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>{feature.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            size="lg" 
            onClick={handleUpgrade} 
            className="text-base px-8 gap-2 bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Zap className="h-4 w-4" />
            Get Instant Access — $497
          </Button>

          <p className="text-xs text-slate-500 mt-4">
            Secure checkout powered by Stripe. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
