import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getRandomLoadingContent } from "@/lib/loadingContent";

const stats = [
  { value: "$1M+", label: "Contracts Won" },
  { value: "50+", label: "Proven Templates" },
  { value: "30 sec", label: "Average Generation Time" },
];

// Animated counter component
function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="text-3xl md:text-4xl font-bold text-primary">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

// Clean video display - no headline overlay
function HeroVideoDisplay() {
  const [content, setContent] = useState(() => getRandomLoadingContent());

  // Rotate video every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setContent(getRandomLoadingContent());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent-secondary/20 rounded-3xl blur-2xl opacity-60 animate-pulse-slow" />
      
      {/* Video Container */}
      <div className="relative animate-float">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 aspect-video">
          <video
            key={content.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src={content.videoUrl} type="video/mp4" />
          </video>
        </div>
        
        {/* Floating badge */}
        <div className="absolute -top-3 -right-3 bg-primary/20 border border-primary/30 rounded-xl px-3 py-2 backdrop-blur-sm animate-pulse-slow">
          <span className="text-xs font-medium text-primary">AI at Work ⚡</span>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-24 pb-20 overflow-hidden flex items-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-radial-gradient" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8 animate-fade-in animate-glow-pulse">
              <Sparkles className="h-4 w-4" />
              Built on a $1M+ winning methodology
            </div>
            
            {/* Headline - Staggered animation */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              <span className="block animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Stop Underpricing.
              </span>
              <span className="block animate-slide-up text-gradient" style={{ animationDelay: '0.2s' }}>
                Start Closing 7-Figure Deals.
              </span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              AI-powered proposal packages that position you as the obvious choice.
              Get a complete proposal, contract, deck, emails, and invoice—in seconds.
            </p>
            
            {/* Problem hook */}
            <p className="text-sm text-muted-foreground/70 mb-8 max-w-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
              You're charging $5K for work that should cost $50K.
              Not because you're underqualified—because you don't know
              what six-figure proposals actually look like.
            </p>
            
            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Button variant="hero" size="xl" asChild className="group">
                <Link to="/generate">
                  Generate Your First Proposal
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="#solution">
                  See a Sample Proposal
                </Link>
              </Button>
            </div>
            
            {/* Trust line */}
            <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.6s' }}>
              Join 500+ consultants closing bigger deals 💼
            </p>
          </div>
          
          {/* Right Side - Video */}
          <div className="lg:pl-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <HeroVideoDisplay />
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="mt-20 pt-12 border-t border-border/30">
          <div className="flex flex-wrap justify-center lg:justify-start gap-12 md:gap-20">
            {stats.map((stat, index) => (
              <AnimatedCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
