import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Instagram, Linkedin, Twitter } from "lucide-react";
import threeStepFlow from "@/assets/dm-closer/three-step-flow.png";
import statsBanner from "@/assets/dm-closer/stats-banner.png";

export function DMFlowSection() {
  const navigate = useNavigate();

  return (
    <section id="dm-closer" className="relative overflow-hidden bg-[#0a0f14]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(34,197,94,0.06),transparent_50%)]" />
      
      {/* 3-Step Flow */}
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              From DM to Deal in <span className="text-emerald-400">3 Clicks</span>
            </h3>
          </div>
          <div className="max-w-5xl mx-auto">
            <img 
              src={threeStepFlow} 
              alt="From DM to Deal in 3 Clicks - Open DM, Click Extension, Copy & Close" 
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Stats Banner */}
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
