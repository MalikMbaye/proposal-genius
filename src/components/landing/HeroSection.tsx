import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { loadingVideos } from "@/lib/loadingContent";
import { AsSeenInMarquee } from "@/components/landing/AsSeenInSection";

const stats = [
  { value: "$1.5M+", label: "In Deals Closed", gradient: "from-emerald-500 via-green-500 to-teal-500" },
  { value: "100+", label: "Real 6 & 7-Figure Proposals", gradient: "from-violet-500 via-purple-500 to-indigo-500" },
  { value: "~5 min", label: "To Generate Your Proposal", gradient: "from-amber-500 via-orange-500 to-yellow-500" },
];

// Stat bubble component with unique gradient and shimmer
function StatBubble({ value, label, gradient, delay = 0 }: { value: string; label: string; gradient: string; delay?: number }) {
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
      className={`relative px-6 py-5 rounded-2xl bg-gradient-to-br ${gradient} shadow-xl transition-all duration-700 text-center overflow-hidden group hover:scale-105 hover:shadow-2xl ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="relative">
        <div className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">{value}</div>
        <div className="text-sm text-white/95 font-medium mt-1">{label}</div>
      </div>
    </div>
  );
}

// Video-only carousel
function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Pick 3 random videos on mount
  const selectedVideos = useMemo(() => {
    const shuffled = [...loadingVideos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, []);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % selectedVideos.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedVideos.length]);

  const currentVideo = selectedVideos[currentIndex];

  return (
    <div className="relative w-full">
      {/* Glow effect */}
      <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-50 animate-pulse-slow bg-gradient-to-r from-primary/40 to-orange-400/40" />
      
      {/* Content Container */}
      <div className="relative animate-float">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 aspect-video">
          <video
            key={currentVideo.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <source src={currentVideo.videoUrl} type="video/mp4" />
          </video>
        </div>
        
        {/* Floating badge */}
        <div className="absolute -top-3 -right-3 bg-white border border-primary/30 rounded-xl px-3 py-2 shadow-lg animate-pulse-slow">
          <span className="text-xs font-medium text-primary">AI at Work ⚡</span>
        </div>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {selectedVideos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 200);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-6 bg-primary'
                : 'w-1.5 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-24 pb-32 overflow-hidden flex items-center section-light">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(to right, hsl(220 20% 20%) 1px, transparent 1px), linear-gradient(to bottom, hsl(220 20% 20%) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />
      
      {/* Very subtle accent orb - just one, positioned top-right */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary/[0.06] to-transparent rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <div className="text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6 animate-fade-in animate-glow-pulse">
              <Sparkles className="h-4 w-4" />
              Built on a $1M+ winning methodology
            </div>
            
            {/* Mobile-only Carousel - between badge and headline */}
            <div className="lg:hidden mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <HeroCarousel />
            </div>
            
            {/* Headline - Staggered animation */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-light-foreground">
              <span className="block animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Stop Underpricing.
              </span>
              <span className="block animate-slide-up text-gradient" style={{ animationDelay: '0.2s' }}>
                Start Closing 7-Figure Deals.
              </span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-light-muted mb-6 max-w-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              AI-powered proposal packages that position you as the obvious choice.
              Get a complete proposal, contract, deck, emails, and invoice—in seconds.
            </p>
            
            {/* Problem hook */}
            <p className="text-sm text-light-muted/80 mb-8 max-w-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
              You're charging $5K for work that should cost $50K.
              Not because you're underqualified—because you don't know
              what six-figure proposals actually look like.
            </p>
            
            {/* CTA */}
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Button variant="hero" size="xl" asChild className="group">
                <Link to="/generate">
                  Generate Your First Proposal
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            
            {/* Trust line - context for marquee */}
            <p className="text-sm text-light-foreground mt-6 mb-2 animate-fade-in font-semibold" style={{ animationDelay: '0.6s' }}>
              <span className="text-primary">Pitch Genius</span> proposals have closed deals with:
            </p>

            {/* Press logos (right under trust line, above stats) */}
            <div className="animate-fade-in" style={{ animationDelay: '0.65s' }}>
              <AsSeenInMarquee />
            </div>
          </div>
          
          {/* Right Side - Carousel (desktop only) */}
          <div className="hidden lg:flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <HeroCarousel />
          </div>
        </div>
        
      </div>
      
      {/* Stats Row - Positioned at bottom as bridge */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <StatBubble key={stat.label} {...stat} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
