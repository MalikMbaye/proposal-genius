import { useEffect, useRef } from "react";

// Premium proposal showcase data
const proposalShowcase = [
  { company: "NASA", category: "Technology Proposal", color: "#0B3D91" },
  { company: "Google", category: "Marketing Strategy", color: "#4285F4" },
  { company: "Nike", category: "Influencer Campaign", color: "#111111" },
  { company: "Tesla", category: "Content Creation", color: "#CC0000" },
  { company: "Apple", category: "App Development", color: "#555555" },
  { company: "Netflix", category: "Video Production", color: "#E50914" },
  { company: "Spotify", category: "Brand Partnership", color: "#1DB954" },
  { company: "Amazon", category: "E-commerce Strategy", color: "#FF9900" },
  { company: "Meta", category: "Social Media", color: "#0081FB" },
  { company: "Adidas", category: "Athlete Sponsorship", color: "#000000" },
  { company: "Twitter", category: "Platform Integration", color: "#1DA1F2" },
  { company: "Adobe", category: "Creative Suite", color: "#FF0000" },
];

function ProposalMiniCard({ company, category, color }: { company: string; category: string; color: string }) {
  return (
    <div className="bg-light-card rounded-xl shadow-lg border border-light-border p-4 min-w-[220px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-shrink-0">
      {/* Header bar */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-light-border/50">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: color }}
        >
          {company.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-light-foreground text-sm">{company}</div>
          <div className="text-xs text-light-muted">{category}</div>
        </div>
      </div>
      
      {/* Fake document lines */}
      <div className="space-y-2">
        <div className="h-2 w-full bg-light-border rounded" />
        <div className="h-2 w-4/5 bg-light-border rounded" />
        <div className="h-2 w-3/4 bg-light-border rounded" />
        <div className="h-2 w-5/6 bg-light-border rounded" />
      </div>
      
      {/* Price tag */}
      <div className="mt-4 pt-3 border-t border-light-border/50 flex items-center justify-between">
        <span className="text-xs text-light-muted">Project Value</span>
        <span className="text-sm font-bold text-primary">${(Math.floor(Math.random() * 150) + 50)}K</span>
      </div>
    </div>
  );
}

function FloatingCarousel({ items, direction = 'left', speed = 30 }: { 
  items: typeof proposalShowcase; 
  direction?: 'left' | 'right';
  speed?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    let animationId: number;
    let scrollPos = direction === 'left' ? 0 : scrollContainer.scrollWidth / 2;
    
    const animate = () => {
      if (!scrollContainer) return;
      
      const maxScroll = scrollContainer.scrollWidth / 2;
      
      if (direction === 'left') {
        scrollPos += 0.5;
        if (scrollPos >= maxScroll) scrollPos = 0;
      } else {
        scrollPos -= 0.5;
        if (scrollPos <= 0) scrollPos = maxScroll;
      }
      
      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationId);
  }, [direction, speed]);
  
  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];
  
  return (
    <div 
      ref={scrollRef}
      className="flex gap-4 overflow-hidden py-2"
      style={{ scrollBehavior: 'auto' }}
    >
      {duplicatedItems.map((item, index) => (
        <ProposalMiniCard 
          key={`${item.company}-${index}`}
          company={item.company}
          category={item.category}
          color={item.color}
        />
      ))}
    </div>
  );
}

export function ProposalComparisonSection() {
  const firstRow = proposalShowcase.slice(0, 6);
  const secondRow = proposalShowcase.slice(6, 12);
  
  return (
    <section className="py-20 section-light overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Premium Templates
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-light-foreground mb-4">
            Proposals That Land <span className="text-primary">Fortune 500</span> Clients
          </h2>
          <p className="text-lg text-light-muted max-w-2xl mx-auto">
            Access the same proposal frameworks used to close deals with the world's biggest brands.
          </p>
        </div>
      </div>
      
      {/* Full-width floating carousels */}
      <div className="space-y-6 mb-12">
        <FloatingCarousel items={firstRow} direction="left" />
        <FloatingCarousel items={secondRow} direction="right" />
      </div>
      
      {/* Stats bar */}
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-light-border">
          <div className="text-center">
            <div className="text-3xl font-bold text-light-foreground">500+</div>
            <div className="text-sm text-light-muted">Enterprise Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-light-foreground">$50M+</div>
            <div className="text-sm text-light-muted">Deals Closed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-light-foreground">12</div>
            <div className="text-sm text-light-muted">Industries Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-mono">10x</div>
            <div className="text-sm text-light-muted">Average ROI</div>
          </div>
        </div>
      </div>
    </section>
  );
}
