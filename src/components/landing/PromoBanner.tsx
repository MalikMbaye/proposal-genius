import { useState, useEffect } from "react";
import { PartyPopper, X, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  // Pulse animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/30">
      {/* Animated glow background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-opacity duration-1000 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />
      
      {/* Sparkle particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-[10%] w-1 h-1 bg-primary/60 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-[25%] w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse delay-300" />
        <div className="absolute top-1/3 right-[20%] w-1 h-1 bg-primary/50 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-1/4 right-[30%] w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse delay-700" />
      </div>

      <div className="container relative mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-center gap-2 md:gap-4 text-center">
          {/* Mobile layout */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 md:h-6 md:w-6 text-primary animate-bounce" />
              <span className="text-lg md:text-xl font-bold text-foreground">
                $100K GIVEAWAY
              </span>
              <PartyPopper className="h-5 w-5 md:h-6 md:w-6 text-primary animate-bounce hidden md:block" />
            </div>
            
            <span className="hidden md:inline text-muted-foreground">—</span>
            
            <p className="text-sm md:text-base text-muted-foreground max-w-md">
              Sign up for Pro and you're automatically entered. Drawing at 1,000 subscribers!
            </p>
          </div>
          
          {/* Close button - positioned absolutely on desktop */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-foreground/10 transition-colors hidden md:flex"
            aria-label="Close banner"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}