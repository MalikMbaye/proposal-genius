import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Chrome, Instagram, Linkedin, Twitter } from "lucide-react";

import heroMockup from "@/assets/dm-closer/hero-mockup.png";
import featureGrid from "@/assets/dm-closer/feature-grid.png";
import threeStepFlow from "@/assets/dm-closer/three-step-flow.png";
import statsBanner from "@/assets/dm-closer/stats-banner.png";

export function DMCloserSection() {
  const navigate = useNavigate();

  return (
    <section id="dm-closer" className="relative overflow-hidden bg-[#0a0f14]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(34,197,94,0.06),transparent_50%)]" />
      
      {/* Part 1: Hero with Mockup */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/20">
              <Chrome className="h-4 w-4" />
              🆕 NEW: DM Sales Assistant
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Stop Wasting Proposals on{" "}
              <span className="text-emerald-400">Unqualified Leads</span>
            </h2>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Know exactly what to say—before you ever send a proposal.
            </p>
          </div>

          {/* Hero Mockup Image */}
          <div className="max-w-4xl mx-auto">
            <img 
              src={heroMockup} 
              alt="DM Closer AI - Turn DMs into booked calls" 
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Part 2: Feature Grid */}
      <div className="py-12 md:py-16 bg-[#080c10]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img 
              src={featureGrid} 
              alt="DM Closer AI Features - Instant Analysis, 3 Response Options, Lead Scoring, Zero Account Risk" 
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Part 3: 3-Step Flow */}
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <img 
              src={threeStepFlow} 
              alt="From DM to Deal in 3 Clicks - Open DM, Click Extension, Copy & Close" 
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Part 4: Stats Banner */}
      <div className="py-12 md:py-16 bg-[#080c10]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <img 
              src={statsBanner} 
              alt="$1.5M+ Closed using this exact system" 
              className="w-full rounded-xl"
            />
          </div>
          
          {/* Platform Compatibility + CTA */}
          <div className="text-center mt-10">
            <p className="text-slate-500 mb-3 text-sm">Works on</p>
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-slate-400">
                <Instagram className="h-5 w-5" />
                <span className="text-sm">Instagram</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Linkedin className="h-5 w-5" />
                <span className="text-sm">LinkedIn</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Twitter className="h-5 w-5" />
                <span className="text-sm">Twitter</span>
              </div>
            </div>

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
      </div>
    </section>
  );
}
