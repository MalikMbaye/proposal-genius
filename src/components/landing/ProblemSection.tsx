import { X, Check } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="py-24 border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            You're Losing <span className="text-destructive">$200K Per Year</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Every underpriced proposal is money you'll never get back.
          </p>
        </div>
        
        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Generic Proposal Card */}
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-br from-destructive/50 to-destructive/20 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative bg-card border border-destructive/30 rounded-2xl p-8 h-full">
              <div className="text-sm uppercase tracking-wider text-destructive font-medium mb-6">
                Most Consultants
              </div>
              
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6">
                <p className="text-muted-foreground italic text-sm leading-relaxed">
                  "We will provide marketing strategy and execution services to help grow your business."
                </p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive flex-shrink-0" />
                  No diagnosis
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive flex-shrink-0" />
                  No strategic insight
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive flex-shrink-0" />
                  Competing on price
                </div>
              </div>
              
              <div className="pt-6 border-t border-border/30">
                <div className="text-3xl font-bold text-muted-foreground mb-1">$5K project</div>
                <div className="text-sm text-muted-foreground">Annual: $50K (10 projects)</div>
              </div>
            </div>
          </div>
          
          {/* Strategic Proposal Card */}
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-br from-success/50 to-success/20 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative bg-card border border-success/30 rounded-2xl p-8 h-full">
              <div className="text-sm uppercase tracking-wider text-success font-medium mb-6">
                Top Consultants
              </div>
              
              <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-6">
                <p className="text-foreground italic text-sm leading-relaxed">
                  "Your brand is stuck at $15K/month not because your product isn't good enough, but because you're missing three critical components: a systematic content engine, a conversion-optimized funnel, and a retention loop that compounds.
                  <br /><br />
                  Here's exactly how we fix each one..."
                </p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                  Problem diagnosis
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                  Strategic framework
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                  Eliminates doubt
                </div>
              </div>
              
              <div className="pt-6 border-t border-border/30">
                <div className="text-3xl font-bold text-success mb-1">$25K project</div>
                <div className="text-sm text-muted-foreground">Annual: $250K (10 projects)</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Big stat highlight */}
        <div className="text-center">
          <div className="inline-block relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent-secondary/20 rounded-2xl blur-2xl opacity-60" />
            <div className="relative bg-card/80 border border-border/50 rounded-2xl px-12 py-8 backdrop-blur-xl">
              <div className="text-5xl md:text-6xl font-bold text-gradient mb-2">
                $200,000 difference
              </div>
              <div className="text-xl text-muted-foreground">
                Every single year.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
