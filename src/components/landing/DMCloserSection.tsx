import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Check,
  Chrome,
  Smartphone,
  MousePointer,
  Copy,
  Instagram,
  Linkedin,
  Twitter,
  TrendingUp,
  DollarSign,
  Users,
  PiggyBank,
  Clock
} from "lucide-react";

export function DMCloserSection() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: Flame,
      title: "Lead Scoring",
      description: "Assess lead potential automatically.",
      visual: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">HOT</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-yellow-400" />
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/30">WARM</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-blue-400" />
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30">COLD</span>
          </div>
        </div>
      )
    },
    {
      icon: MessageSquare,
      title: "3 Response Options",
      description: "Get three tailored reply choices.",
      visual: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-emerald-500/30 rounded-full" />
            <Check className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-amber-500/20 rounded-full" />
            <div className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-slate-700 rounded-full" />
            <div className="h-4 w-4" />
          </div>
        </div>
      )
    },
    {
      icon: Sparkles,
      title: "Instant Analysis",
      description: "Analyze chats instantly with AI.",
      visual: (
        <div className="relative">
          <div className="w-16 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-slate-500" />
          </div>
          <div className="absolute -right-2 -bottom-1 flex items-center gap-0.5">
            <div className="w-8 h-1 bg-emerald-400 rounded-full animate-pulse" />
            <div className="w-6 h-1 bg-emerald-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      )
    },
    {
      icon: ShieldCheck,
      title: "Zero Account Risk",
      description: "Secure and safe for your account.",
      visual: (
        <div className="relative">
          <div className="w-14 h-16 bg-gradient-to-b from-slate-600 to-slate-700 rounded-lg flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
        </div>
      )
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Open DM",
      description: "Open any DM conversation on Instagram, LinkedIn, or Twitter",
      icon: Smartphone,
      time: "5 seconds"
    },
    {
      number: 2,
      title: "Click Extension",
      description: "Click the DM Closer AI extension and hit 'Analyze Current DM'",
      icon: MousePointer,
      time: "5 seconds"
    },
    {
      number: 3,
      title: "Copy & Close",
      description: "Get 3 response options, copy the best one, and book the call",
      icon: Copy,
      time: "5 seconds"
    }
  ];

  const stats = [
    { icon: TrendingUp, value: "$10M+", label: "Client Revenue" },
    { icon: DollarSign, value: "$50M+", label: "Capital Raised" },
    { icon: Users, value: "<2K", label: "Followers" },
    { icon: PiggyBank, value: "$5-10K/mo", label: "Saved on Setters" }
  ];

  return (
    <section id="dm-closer" className="py-24 relative overflow-hidden bg-[#0a0f14]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(34,197,94,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.05),transparent_50%)]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/20">
            <Chrome className="h-4 w-4" />
            🆕 NEW: DM Sales Assistant
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Stop Wasting Proposals on{" "}
            <span className="text-emerald-400">Unqualified Leads</span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-4">
            Know exactly what to say—before you ever send a proposal. 
            AI that scores your leads, suggests the perfect response, and tells you when they're ready to close.
          </p>
          
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            The same qualification framework behind $1.5M in closed deals—now analyzing your DMs in real-time from a simple screenshot.
          </p>
        </div>

        {/* Feature Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-20">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative p-6 bg-slate-900/80 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 cursor-default"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  {feature.visual}
                </div>
              </div>
              
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
            </div>
          ))}
        </div>

        {/* 3-Step Flow */}
        <div className="mb-20">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            From DM to Deal in{" "}
            <span className="text-emerald-400 relative">
              3 Clicks
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8" fill="none" stroke="#22c55e" strokeWidth="2" />
              </svg>
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-emerald-500/50" />
                  </div>
                )}
                
                <div className="text-center">
                  {/* Step card */}
                  <div className="relative bg-slate-900/80 border border-slate-700 rounded-2xl p-6 mb-4 mx-auto max-w-[280px]">
                    <div className="w-16 h-16 mx-auto bg-slate-800 rounded-xl flex items-center justify-center mb-4 border border-slate-700">
                      <step.icon className="h-8 w-8 text-emerald-400" />
                    </div>
                    
                    {/* Time badge */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">
                      <Clock className="h-3 w-3" />
                      {step.time}
                    </div>
                  </div>
                  
                  {/* Number circle */}
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500 text-white font-bold rounded-full mb-3 shadow-lg shadow-emerald-500/25">
                    {step.number}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-center text-slate-400 mt-8">
            Effortlessly close deals directly from your DMs. Try{" "}
            <span className="text-emerald-400 font-medium">DM Closer AI</span> now!
          </p>
        </div>

        {/* Stats Banner */}
        <div className="relative bg-slate-900/80 rounded-2xl border border-slate-700 p-8 md:p-12 mb-16">
          {/* Floating testimonials */}
          <div className="absolute -top-4 left-8 hidden md:block">
            <span className="text-slate-500 text-sm italic">"Finally, something that actually <span className="text-emerald-400">works</span>..."</span>
          </div>
          <div className="absolute -top-4 right-8 hidden md:block">
            <span className="text-slate-500 text-sm italic">"This changed <span className="text-emerald-400">everything</span>..."</span>
          </div>
          
          {/* Built by badge */}
          <div className="absolute -top-4 md:top-4 right-4 md:right-8 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 hidden lg:flex items-center gap-2">
            <span className="text-sm font-medium text-white">Built by</span>
            <span className="text-sm text-blue-400 font-medium">ex-Meta PM</span>
            <span className="text-blue-400 text-lg">∞</span>
          </div>
          
          <div className="text-center mb-8">
            <h3 className="text-5xl md:text-6xl font-bold text-emerald-400 mb-2">
              $1.5M+ Closed
            </h3>
            <p className="text-xl text-slate-400">Using this exact system</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                <stat.icon className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Compatibility */}
        <div className="text-center mb-12">
          <p className="text-slate-400 mb-4">Works on</p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-slate-300">
              <Instagram className="h-6 w-6" />
              <span className="text-sm">Instagram</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Linkedin className="h-6 w-6" />
              <span className="text-sm">LinkedIn</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Twitter className="h-6 w-6" />
              <span className="text-sm">Twitter</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 py-6 h-auto group shadow-lg shadow-emerald-500/25"
            onClick={() => navigate('/leads')}
          >
            Try It Free
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <p className="text-sm text-slate-500 mt-4 flex items-center justify-center gap-2">
            <Check className="h-4 w-4 text-emerald-500" />
            Included with your PitchGenius account
          </p>
        </div>
      </div>
    </section>
  );
}
