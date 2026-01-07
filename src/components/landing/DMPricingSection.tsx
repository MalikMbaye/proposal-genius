import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Shield, Zap, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { DM_TIERS, DMTier } from "@/lib/dmSubscription";
import { toast } from "sonner";

const dmPlans: {
  tier: DMTier;
  popular?: boolean;
  variant: "outline" | "hero";
}[] = [
  { tier: "free", variant: "outline" },
  { tier: "starter", variant: "outline" },
  { tier: "growth", popular: true, variant: "hero" },
  { tier: "unlimited", variant: "outline" },
];

export function DMPricingSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    openCheckout, 
    has_lifetime,
    subscribed,
  } = useSubscription();

  const handlePlanClick = async (tier: DMTier) => {
    // Free tier - just go to the extension or generate
    if (tier === "free") {
      navigate('/generate');
      return;
    }

    // If not logged in, go to auth first
    if (!user) {
      navigate('/auth');
      return;
    }

    // Try to open checkout for DM subscription
    try {
      await openCheckout(`dm_${tier}` as any);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to open checkout. Please try again.');
    }
  };

  const isPitchGeniusCustomer = subscribed || has_lifetime;

  return (
    <section id="dm-pricing" className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <MessageSquare className="h-4 w-4" />
            DM Closer AI Pricing
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Turn DMs Into Deals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your closing volume
          </p>
          
          {isPitchGeniusCustomer && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full text-success text-sm font-medium">
              <Check className="h-4 w-4" />
              PitchGenius customer — get Growth tier for $19/mo instead of $29!
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {dmPlans.map(({ tier, popular, variant }) => {
            const config = DM_TIERS[tier];
            const showDiscountPrice = tier === "growth" && isPitchGeniusCustomer;
            
            return (
              <div 
                key={tier}
                className={`relative rounded-2xl p-6 ${
                  popular 
                    ? 'bg-card border-2 border-primary shadow-xl shadow-primary/10' 
                    : 'bg-card/50 border border-border/50'
                }`}
              >
                {/* Popular badge */}
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    Best Value 🔥
                  </div>
                )}

                {/* Plan name */}
                <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium mb-4 mt-2">
                  {config.name}
                </div>

                {/* Price */}
                <div className="mb-1">
                  {showDiscountPrice && tier === "growth" ? (
                    <>
                      <span className="text-xl text-muted-foreground line-through mr-2">
                        {config.priceDisplay}
                      </span>
                      <span className="text-3xl font-bold text-success">
                        $19
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">
                      {config.priceDisplay}
                    </span>
                  )}
                  <span className="text-muted-foreground ml-1 text-sm">{config.period}</span>
                </div>

                {/* Limits summary */}
                <p className="text-sm text-muted-foreground mb-6">
                  {tier === "unlimited" 
                    ? "Unlimited everything" 
                    : `${config.analyses_limit} analyses • ${config.leads_limit} leads`
                  }
                </p>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {config.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button 
                  variant={variant} 
                  size="sm" 
                  className="w-full group"
                  onClick={() => handlePlanClick(tier)}
                >
                  {tier === "free" ? "Get Started" : "Subscribe"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            );
          })}
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
            <MessageSquare className="h-4 w-4 text-primary" />
            Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}
