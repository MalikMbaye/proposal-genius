import { Trophy, Layers, Shield } from "lucide-react";

const differentiators = [
  {
    icon: Trophy,
    number: "1",
    title: "Built on $1M+ in Closed Deals",
    description: "This isn't theory. Every framework, every pricing structure, every positioning strategy comes from real contracts that closed real money.",
  },
  {
    icon: Layers,
    number: "2",
    title: "Multiple Pricing Scenarios Included",
    description: "Don't just give one price. Show 3-4 options (Strategy Only, Strategy + Execution, Fully Managed, Partnership) so clients choose their investment level.",
  },
  {
    icon: Shield,
    number: "3",
    title: "Risk Mitigation Built-In",
    description: 'Include "What\'s Not Included", "Client Responsibilities", and "What Success Requires" sections that protect you from scope creep and set realistic expectations.',
  },
];

export function DifferentiationSection() {
  return (
    <section className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column - Content */}
          <div>
            {/* Header */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why This Works When <span className="text-gradient">Templates Fail</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Most proposal tools give you fill-in-the-blank templates.
              We give you the patterns that win six-figure contracts.
            </p>
            
            {/* Differentiators */}
            <div className="space-y-8">
              {differentiators.map((item) => (
                <div key={item.title} className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {item.number}
                      </span>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Visual Mockup */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent-secondary/10 rounded-3xl blur-2xl opacity-60" />
            
            <div className="relative bg-card border border-border/50 rounded-2xl p-6 shadow-2xl">
              {/* Window controls */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/30">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">pricing-scenarios.md</span>
              </div>
              
              {/* Mock proposal pricing section */}
              <div className="space-y-4">
                <div className="text-sm font-bold text-foreground mb-4">Investment Options</div>
                
                {[
                  { tier: "Strategy Only", price: "$15,000", highlight: false },
                  { tier: "Strategy + Execution", price: "$35,000", highlight: true },
                  { tier: "Fully Managed", price: "$75,000", highlight: false },
                  { tier: "Partnership Model", price: "$125,000+", highlight: false },
                ].map((option) => (
                  <div 
                    key={option.tier}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      option.highlight 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-secondary/30 border-border/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {option.highlight && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          RECOMMENDED
                        </span>
                      )}
                      <span className={`text-sm ${option.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {option.tier}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${option.highlight ? 'text-primary' : 'text-foreground'}`}>
                      {option.price}
                    </span>
                  </div>
                ))}
                
                {/* Risk mitigation preview */}
                <div className="mt-6 pt-4 border-t border-border/30">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Risk Mitigation Sections
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["What's Not Included", "Client Responsibilities", "Success Criteria"].map((item) => (
                      <span key={item} className="text-xs bg-success/10 text-success px-2 py-1 rounded border border-success/20">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
