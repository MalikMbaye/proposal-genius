import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Chrome } from "lucide-react";
import heroMockup from "@/assets/dm-closer/hero-mockup.png";

export function DMHeroTeaser() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-20 bg-[#0a0f14]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/20">
              <Chrome className="h-4 w-4" />
              🆕 NEW: DM Sales Assistant
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Before You Propose,{" "}
              <span className="text-emerald-400">Qualify the Lead</span>
            </h2>
            
            <p className="text-lg text-slate-400 mb-6">
              Know exactly what to say in DMs—before you ever send a proposal. 
              AI that scores your leads and suggests the perfect response.
            </p>

            <Button 
              size="lg" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white group"
              onClick={() => {
                document.getElementById('dm-closer')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div>
            <img 
              src={heroMockup} 
              alt="DM Closer AI - Turn DMs into booked calls" 
              className="w-full rounded-xl shadow-2xl shadow-emerald-500/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
