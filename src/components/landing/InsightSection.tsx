import { MetaGallery } from "./MetaGallery";

const journeyPoints = [
  { value: "$250", label: "First freelance project" },
  { value: "$250K+", label: "Current projects" },
];

export function InsightSection() {
  return (
    <section className="py-24 border-t border-border/50 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container relative mx-auto px-4">
        {/* Section label */}
        <div className="text-center mb-8">
          <span className="inline-block text-sm uppercase tracking-widest text-primary font-medium px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            The $300K Lesson
          </span>
        </div>
        
        {/* Main headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center max-w-4xl mx-auto mb-12 leading-tight">
          I Reviewed a $300K Proposal at Meta.
          <br />
          <span className="text-gradient">It Wasn't More Complex Than the $3K Site I Built.</span>
        </h2>
        
        {/* Story */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              9 months into my role at Meta, I was tasked with reviewing
              a $300K proposal for a website redesign.
            </p>
            <p>
              I had just finished a $3K WordPress site for a fintech startup
              on the side. Same complexity. Similar scope.
            </p>
            <p className="text-foreground font-medium">
              So why did one cost $3K and the other $300K?
            </p>
            
            {/* Three factors */}
            <div className="py-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-left">
                  <div className="text-2xl font-bold text-primary mb-2">→</div>
                  <div className="font-medium text-foreground mb-1">Who the client is</div>
                  <div className="text-sm text-muted-foreground">(risk elimination)</div>
                </div>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-left">
                  <div className="text-2xl font-bold text-primary mb-2">→</div>
                  <div className="font-medium text-foreground mb-1">The process behind the work</div>
                  <div className="text-sm text-muted-foreground">(trust building)</div>
                </div>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-left">
                  <div className="text-2xl font-bold text-primary mb-2">→</div>
                  <div className="font-medium text-foreground mb-1">The risk level</div>
                  <div className="text-sm text-muted-foreground">(certainty premium)</div>
                </div>
              </div>
            </div>
            
            <p>
              Big brands don't pay for deliverables.
              <br />
              <span className="text-foreground font-semibold">They pay to eliminate risk.</span>
            </p>
            
            <p className="text-xl text-foreground font-bold pt-4">
              That's when I realized: the proposal IS the product.
            </p>
          </div>
        </div>
        
        {/* Journey timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-muted via-primary to-primary rounded-full transform -translate-y-1/2" />
            
            {/* Timeline points */}
            <div className="relative flex justify-between">
              {journeyPoints.map((point, index) => (
                <div key={point.value} className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mb-3 ${
                    index === journeyPoints.length - 1 
                      ? 'bg-primary border-primary shadow-lg shadow-primary/50' 
                      : 'bg-card border-border'
                  }`} />
                  <div className={`text-lg md:text-xl font-bold ${
                    index === journeyPoints.length - 1 ? 'text-primary' : 'text-foreground'
                  }`}>
                    {point.value}
                  </div>
                  <div className="text-xs text-muted-foreground text-center max-w-20">
                    {point.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Meta Gallery - at the end of section */}
        <MetaGallery />
      </div>
    </section>
  );
}
