import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Shield, Zap, CreditCard } from "lucide-react";

const pricingPlans = [
  {
    name: "Try It Free",
    price: "$0",
    period: "1 proposal",
    description: "See the quality before you buy",
    features: [
      { text: "Generate 1 complete proposal package", included: true },
      { text: "All 6 deliverables included", included: true },
      { text: "See the quality before you buy", included: true },
      { text: "No proposal library access", included: false },
      { text: "No future proposals", included: false },
    ],
    cta: "Start Free",
    ctaLink: "/auth",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro Access",
    price: "$27",
    period: "/month",
    description: "Everything you need to close bigger deals",
    features: [
      { text: "Up to 20 proposals per month", included: true },
      { text: "All 6 deliverables every time", included: true },
      { text: "Access to 50+ proposal library", included: true },
      { text: "Case studies and examples", included: true },
      { text: "Monthly updates & new features", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Start Generating",
    ctaLink: "/auth",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Lifetime Access",
    price: "$297",
    period: "one-time",
    description: "Pay once, use forever",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited proposals forever", included: true },
      { text: "All future updates included", included: true },
      { text: "3-hour Strategic Positioning Masterclass", included: true },
      { text: "VIP support", included: true },
    ],
    cta: "Get Lifetime Access",
    ctaLink: "/auth",
    variant: "outline" as const,
    popular: false,
    badge: "Best Value 💎",
    savings: "Save $27/month forever",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            No subscriptions. No per-proposal fees. Unlimited proposals forever.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-card border-2 border-primary shadow-xl shadow-primary/10' 
                  : 'bg-card/50 border border-border/50'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                  Most Popular 🔥
                </div>
              )}
              
              {/* Badge (for lifetime) */}
              {plan.badge && !plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-secondary text-white text-sm font-bold rounded-full">
                  {plan.badge}
                </div>
              )}
              
              {/* Plan name */}
              <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium mb-4 mt-2">
                {plan.name}
              </div>
              
              {/* Price */}
              <div className="mb-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">{plan.period}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-8">
                {plan.description}
              </p>
              
              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature.text} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* CTA */}
              <Button 
                variant={plan.variant} 
                size="lg" 
                className="w-full group"
                asChild
              >
                <Link to={plan.ctaLink}>
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              {/* Savings note */}
              {plan.savings && (
                <p className="text-sm text-success text-center mt-4 font-medium">
                  {plan.savings}
                </p>
              )}
            </div>
          ))}
        </div>
        
        {/* Trust line */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Secure payment via Stripe
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Instant access
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            30-day money-back guarantee
          </div>
        </div>
      </div>
    </section>
  );
}
