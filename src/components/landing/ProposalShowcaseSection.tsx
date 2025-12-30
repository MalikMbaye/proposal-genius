import { useEffect, useState, useRef } from 'react';

const proposalExamples = [
  {
    type: 'generic',
    label: '❌ Generic Proposal',
    quote: '"We will provide marketing strategy and execution services to help grow your business."',
    value: '$5,000',
    labelColor: 'text-destructive',
    valueColor: 'text-muted-foreground',
  },
  {
    type: 'strategic',
    label: '✓ Strategic Proposal',
    quote: '"Your brand is stuck at $15K/month not because your product isn\'t good enough, but because you\'re missing three critical components..."',
    value: '$50,000',
    labelColor: 'text-success',
    valueColor: 'text-primary',
  },
  {
    type: 'generic',
    label: '❌ Generic Proposal',
    quote: '"Our team will help optimize your sales funnel and improve conversions."',
    value: '$3,500',
    labelColor: 'text-destructive',
    valueColor: 'text-muted-foreground',
  },
  {
    type: 'strategic',
    label: '✓ Strategic Proposal',
    quote: '"You\'re leaving $2M on the table annually because your current checkout flow has 3 friction points that are killing conversions..."',
    value: '$75,000',
    labelColor: 'text-success',
    valueColor: 'text-primary',
  },
  {
    type: 'generic',
    label: '❌ Generic Proposal',
    quote: '"We offer comprehensive consulting services tailored to your needs."',
    value: '$8,000',
    labelColor: 'text-destructive',
    valueColor: 'text-muted-foreground',
  },
  {
    type: 'strategic',
    label: '✓ Strategic Proposal',
    quote: '"Your competitor just raised $10M and is outspending you 4:1 on acquisition. Here\'s the 90-day plan to win anyway..."',
    value: '$120,000',
    labelColor: 'text-success',
    valueColor: 'text-primary',
  },
];

export function ProposalShowcaseSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate proposals
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % proposalExamples.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const current = proposalExamples[currentIndex];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-4">
            The Difference
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Same Skill.{' '}
            <span className="text-gradient">10x the Price.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The difference between a $5K and $50K proposal isn't your expertise—it's how you position it.
          </p>
        </div>

        {/* Cards Display */}
        <div className="max-w-4xl mx-auto">
          <div className={`relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Main Card */}
            <div className="relative">
              {/* Glow effect */}
              <div className={`absolute -inset-4 rounded-3xl blur-2xl opacity-40 transition-colors duration-500 ${
                current.type === 'strategic' 
                  ? 'bg-gradient-to-r from-primary/30 to-success/30' 
                  : 'bg-gradient-to-r from-destructive/20 to-muted/20'
              }`} />
              
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">
                {/* Window controls */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/30">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                  <span className="ml-3 text-xs text-muted-foreground font-mono">proposal.md</span>
                </div>
                
                {/* Content */}
                <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                  <div className={`text-xs uppercase tracking-wider mb-4 font-semibold ${current.labelColor}`}>
                    {current.label}
                  </div>
                  <p className="text-lg md:text-xl leading-relaxed text-foreground mb-8 min-h-[80px]">
                    {current.quote}
                  </p>
                  <div className="pt-6 border-t border-border/30 flex items-end justify-between">
                    <div>
                      <div className={`text-4xl md:text-5xl font-bold ${current.valueColor}`}>
                        {current.value}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Project Value</div>
                    </div>
                    {current.type === 'strategic' && (
                      <div className="bg-success/10 border border-success/20 rounded-lg px-4 py-2">
                        <span className="text-success font-semibold text-sm">+900% ROI</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Indicator dots */}
            <div className="flex justify-center gap-2 mt-8">
              {proposalExamples.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentIndex(index);
                      setIsTransitioning(false);
                    }, 200);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
