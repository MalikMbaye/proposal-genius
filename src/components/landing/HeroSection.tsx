import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { loadingVideos } from "@/lib/loadingContent";
import { AsSeenInMarquee } from "@/components/landing/AsSeenInSection";

const stats = [
  { value: "$1.5M+", label: "Contracts Closed" },
  { value: "50+", label: "Proven Templates" },
  { value: "5 min", label: "Get Your Proposal" },
];

// Proposal comparison cards
const proposalCards = [
  {
    type: 'generic',
    label: '❌ Generic Proposal',
    quote: '"We will provide marketing strategy and execution services to help grow your business."',
    value: '$5,000',
  },
  {
    type: 'strategic',
    label: '✓ Strategic Proposal',
    quote: '"Your brand is stuck at $15K/month not because your product isn\'t good enough, but because you\'re missing three critical components..."',
    value: '$50,000',
  },
  {
    type: 'generic',
    label: '❌ Generic Proposal',
    quote: '"Our team will help optimize your sales funnel and improve conversions."',
    value: '$3,500',
  },
  {
    type: 'strategic',
    label: '✓ Strategic Proposal',
    quote: '"You\'re leaving $2M on the table annually because your checkout flow has 3 friction points killing conversions..."',
    value: '$75,000',
  },
  {
    type: 'generic',
    label: '❌ Generic Proposal',
    quote: '"We offer comprehensive consulting services tailored to your needs."',
    value: '$8,000',
  },
  {
    type: 'strategic',
    label: '✓ Strategic Proposal',
    quote: '"Your competitor just raised $10M and is outspending you 4:1 on acquisition. Here\'s the 90-day plan to win anyway..."',
    value: '$120,000',
  },
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

// Combined carousel: 3 random videos + all proposal cards
function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Pick 3 random videos on mount
  const selectedVideos = useMemo(() => {
    const shuffled = [...loadingVideos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, []);

  // Build carousel items: interleave videos and cards
  // Pattern: video, card, card, video, card, card, video, card, card...
  const carouselItems = useMemo(() => {
    const items: Array<{ type: 'video'; videoUrl: string } | { type: 'card'; card: typeof proposalCards[0] }> = [];
    
    let videoIndex = 0;
    let cardIndex = 0;
    
    // Interleave: video, then 2 cards, repeat
    while (cardIndex < proposalCards.length || videoIndex < selectedVideos.length) {
      if (videoIndex < selectedVideos.length) {
        items.push({ type: 'video', videoUrl: selectedVideos[videoIndex].videoUrl });
        videoIndex++;
      }
      // Add 2 cards after each video
      for (let i = 0; i < 2 && cardIndex < proposalCards.length; i++) {
        items.push({ type: 'card', card: proposalCards[cardIndex] });
        cardIndex++;
      }
    }
    
    return items;
  }, [selectedVideos]);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const currentItem = carouselItems[currentIndex];

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      {/* Glow effect */}
      <div className={`absolute -inset-4 rounded-3xl blur-2xl opacity-60 animate-pulse-slow transition-colors duration-500 ${
        currentItem.type === 'card' && currentItem.card.type === 'strategic'
          ? 'bg-gradient-to-r from-primary/30 to-success/30'
          : currentItem.type === 'card' && currentItem.card.type === 'generic'
          ? 'bg-gradient-to-r from-destructive/20 to-muted/20'
          : 'bg-gradient-to-r from-primary/20 to-accent-secondary/20'
      }`} />
      
      {/* Content Container */}
      <div className="relative animate-float">
        <div className={`relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 transition-all duration-300 ${
          currentItem.type === 'video' ? 'aspect-video' : 'min-h-[280px]'
        }`}>
          {/* Video */}
          {currentItem.type === 'video' && (
            <video
              key={currentItem.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <source src={currentItem.videoUrl} type="video/mp4" />
            </video>
          )}
          
          {/* Proposal Card */}
          {currentItem.type === 'card' && (
            <div className="bg-card p-6 h-full flex flex-col">
              {/* Window controls */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/30">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">proposal.md</span>
              </div>
              
              {/* Content */}
              <div className={`flex-1 flex flex-col transition-all duration-300 ${
                isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}>
                <div className={`text-xs uppercase tracking-wider mb-3 font-semibold ${
                  currentItem.card.type === 'strategic' ? 'text-success' : 'text-destructive'
                }`}>
                  {currentItem.card.label}
                </div>
                <p className="text-sm leading-relaxed text-foreground flex-1">
                  {currentItem.card.quote}
                </p>
                <div className="pt-4 mt-4 border-t border-border/30 flex items-end justify-between">
                  <div>
                    <div className={`text-2xl font-bold ${
                      currentItem.card.type === 'strategic' ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {currentItem.card.value}
                    </div>
                    <div className="text-xs text-muted-foreground">Project Value</div>
                  </div>
                  {currentItem.card.type === 'strategic' && (
                    <div className="bg-success/10 border border-success/20 rounded px-2 py-1">
                      <span className="text-success font-semibold text-xs">+900% ROI</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Floating badge */}
        <div className="absolute -top-3 -right-3 bg-primary/20 border border-primary/30 rounded-xl px-3 py-2 backdrop-blur-sm animate-pulse-slow">
          <span className="text-xs font-medium text-primary">
            {currentItem.type === 'video' ? 'AI at Work ⚡' : currentItem.card.type === 'strategic' ? '10x Value 🚀' : 'vs.'}
          </span>
        </div>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {carouselItems.map((item, index) => (
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
                ? `w-6 ${item.type === 'video' ? 'bg-primary' : item.type === 'card' && item.card.type === 'strategic' ? 'bg-success' : 'bg-destructive/60'}`
                : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
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

            {/* Press logos (right under trust line, above stats) */}
            <div className="animate-fade-in" style={{ animationDelay: '0.65s' }}>
              <AsSeenInMarquee />
            </div>
          </div>
          
          {/* Right Side - Carousel */}
          <div className="lg:pl-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <HeroCarousel />
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
