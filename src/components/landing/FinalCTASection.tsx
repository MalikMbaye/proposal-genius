import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-24 border-t border-border/50 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stop Undercharging for Your Work
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            Every day without this system is another underpriced proposal.
            <br />
            Another <span className="text-primary font-semibold">$20K left on the table</span>.
          </p>
          
          {/* Value points */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              "Minimize risk for the client",
              "Refine your process and positioning",
              "Build proposals that eliminate doubt",
            ].map((point) => (
              <div key={point} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 text-primary" />
                {point}
              </div>
            ))}
          </div>
          
          <p className="text-muted-foreground mb-10">
            Join 500+ consultants who've stopped competing on price
            and started winning on value.
          </p>
          
          {/* CTA */}
          <Button variant="hero" size="xl" asChild className="group">
            <Link to="/generate">
              Generate Your First Proposal Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          
          {/* Trust line */}
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required for free trial · 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
