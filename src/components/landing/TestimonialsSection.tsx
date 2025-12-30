import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "I went from $5K projects to closing my first $25K engagement within 3 weeks. The difference isn't my skill—it's knowing what six-figure proposals actually say.",
    name: "Sarah Chen",
    role: "Marketing Consultant",
    before: "$5K avg",
    after: "$25K avg",
    avatar: "SC",
  },
  {
    quote: "The pricing scenarios alone changed my business. Instead of one $10K option, I now present 4 tiers. Clients choose $15K-40K. Every single time.",
    name: "Marcus Johnson",
    role: "Product Strategy",
    before: "$10K fixed",
    after: "$15K-40K range",
    avatar: "MJ",
  },
  {
    quote: "I've closed $200K in contracts using these frameworks. The proposals position me as the strategic partner, not just another vendor. Game changer.",
    name: "Priya Desai",
    role: "Growth Consultant",
    before: "",
    after: "$200K in 6 months",
    avatar: "PD",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Consultants Using This Are <span className="text-gradient">Closing Bigger Deals</span>
          </h2>
        </div>
        
        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.name}
              className="bg-card border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-foreground mb-8 leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
              
              {/* Before/After stats */}
              <div className="pt-6 border-t border-border/30">
                {testimonial.before ? (
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Before</div>
                      <div className="text-sm text-muted-foreground">{testimonial.before}</div>
                    </div>
                    <div className="text-primary">→</div>
                    <div>
                      <div className="text-xs text-success uppercase tracking-wider">After</div>
                      <div className="text-sm font-semibold text-success">{testimonial.after}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs text-success uppercase tracking-wider">Result</div>
                    <div className="text-sm font-semibold text-success">{testimonial.after}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
