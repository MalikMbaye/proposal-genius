import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Shield, Zap, CreditCard, Clock, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Launch promo state type
interface LaunchPromoState {
  promo_available: boolean;
  spots_remaining: number;
  total_spots: number;
  discount_percent: number;
  promo_price: string;
  promo_code?: string;
}

const pricingPlans = [
  {
    name: "Try It Free",
    price: "$0",
    originalPrice: null,
    period: "2 proposals",
    billingNote: null,
    description: "See the quality before you buy",
    features: [
      { text: "Generate 2 complete proposal packages", included: true },
      { text: "All 6 deliverables included", included: true },
      { text: "See the quality before you buy", included: true },
      { text: "No proposal library access", included: false },
      { text: "No future proposals after trial", included: false },
    ],
    cta: "Start Free",
    productType: null as null,
    variant: "outline" as const,
    popular: false,
    isLifetime: false,
    isAnnual: false,
  },
  {
    name: "Pro Annual",
    price: "$27",
    originalPrice: "$40",
    period: "/month",
    billingNote: "Billed annually at $197 (save 18%)",
    description: "Everything you need to close bigger deals",
    features: [
      { text: "Unlimited proposals per month", included: true },
      { text: "All 6 deliverables every time", included: true },
      { text: "Access to 50+ proposal library*", included: true },
      { text: "Case studies and examples", included: true },
      { text: "Monthly updates & new features", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Get Pro Access",
    productType: "pro_annual" as const,
    variant: "hero" as const,
    popular: true,
    isLifetime: false,
    isAnnual: true,
  },
  {
    name: "Lifetime Access",
    price: "$497",
    originalPrice: null,
    period: "one-time",
    billingNote: null,
    description: "Pay once, use forever",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited proposals forever", included: true },
      { text: "All future updates included", included: true },
      { text: "3-hour Strategic Positioning Masterclass", included: true },
      { text: "VIP support", included: true },
    ],
    cta: "Get Lifetime Access",
    productType: "lifetime" as const,
    variant: "outline" as const,
    popular: false,
    badge: "Best Value 💎",
    savings: "Save $27/month forever",
    isLifetime: true,
    isAnnual: false,
  },
];

export function PricingSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    openCheckout, 
    subscribed, 
    subscription_type, 
    has_lifetime,
    lifetime_available,
    lifetime_spots_remaining,
    checkLifetimeAvailability
  } = useSubscription();
  
  // Launch promo state (separate from lifetime spots)
  const [launchPromo, setLaunchPromo] = useState<LaunchPromoState>({
    promo_available: false,
    spots_remaining: 0,
    total_spots: 10,
    discount_percent: 50,
    promo_price: "$97",
  });
  
  // Check lifetime availability on mount
  useEffect(() => {
    checkLifetimeAvailability();
  }, [checkLifetimeAvailability]);
  
  // Check launch promo availability separately
  useEffect(() => {
    const checkLaunchPromo = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-launch-promo');
        if (!error && data) {
          setLaunchPromo(data);
        }
      } catch (err) {
        console.error('Error checking launch promo:', err);
      }
    };
    
    checkLaunchPromo();
  }, []);

  const handlePlanClick = async (plan: typeof pricingPlans[0]) => {
    // Free tier - just go to generate
    if (!plan.productType) {
      navigate('/generate');
      return;
    }

    // Lifetime not available if already subscribed (only at signup)
    if (plan.productType === 'lifetime' && subscribed) {
      toast.error('Lifetime access is only available for new users');
      return;
    }

    // Lifetime sold out
    if (plan.productType === 'lifetime' && !lifetime_available) {
      toast.error('Lifetime access is sold out');
      return;
    }

    // If not logged in, go to auth first
    if (!user) {
      navigate('/auth');
      return;
    }

    // Try to open checkout
    try {
      await openCheckout(plan.productType);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to open checkout. Please try again.');
    }
  };

  return (
    <section id="pricing" className="py-24 border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you're ready
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const isCurrentPlan = subscribed && subscription_type === plan.productType;
            const isLifetimeSoldOut = plan.isLifetime && !lifetime_available;
            const isLifetimeUnavailable = plan.isLifetime && subscribed && !has_lifetime;
            const isDisabled = isCurrentPlan || isLifetimeSoldOut || isLifetimeUnavailable;
            
            return (
              <div 
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-card border-2 border-primary shadow-xl shadow-primary/10' 
                    : 'bg-card/50 border border-border/50'
                } ${isCurrentPlan ? 'ring-2 ring-success' : ''} ${isLifetimeSoldOut ? 'opacity-75' : ''}`}
              >
                {/* Popular badge */}
                {plan.popular && !isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                    Most Popular 🔥
                  </div>
                )}
                
                {/* Current plan badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-success text-white text-sm font-bold rounded-full">
                    Your Plan ✓
                  </div>
                )}
                
                {/* Sold out badge for lifetime */}
                {isLifetimeSoldOut && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-destructive text-white text-sm font-bold rounded-full">
                    Sold Out
                  </div>
                )}
                
                {/* Limited spots badge for lifetime */}
                {plan.isLifetime && lifetime_available && !isCurrentPlan && !subscribed && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Only {lifetime_spots_remaining} spots left!
                  </div>
                )}
                
                {/* Badge (for lifetime - only show if not sold out and no other badge) */}
                {plan.badge && !plan.popular && !isCurrentPlan && !plan.isLifetime && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-secondary text-white text-sm font-bold rounded-full">
                    {plan.badge}
                  </div>
                )}
                
                {/* Plan name */}
                <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium mb-4 mt-2">
                  {plan.name}
                </div>
                
                {/* Price */}
                <div className="mb-1">
                  {plan.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through mr-2">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className={`text-4xl font-bold ${isLifetimeSoldOut ? 'line-through text-muted-foreground' : ''}`}>
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                
                {/* Billing note for annual */}
                {plan.billingNote && (
                  <p className="text-xs text-primary font-medium mb-2">
                    {plan.billingNote}
                  </p>
                )}
                
                <p className="text-sm text-muted-foreground mb-8">
                  {isLifetimeSoldOut 
                    ? 'This offer has ended' 
                    : isLifetimeUnavailable
                    ? 'Only available for new users'
                    : plan.description
                  }
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
                  onClick={() => handlePlanClick(plan)}
                  disabled={isDisabled}
                >
                  {isCurrentPlan 
                    ? 'Current Plan' 
                    : isLifetimeSoldOut 
                    ? 'Sold Out'
                    : isLifetimeUnavailable
                    ? 'Not Available'
                    : plan.cta
                  }
                  {!isDisabled && (
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Button>
                
                {/* Savings note */}
                {plan.savings && !isLifetimeSoldOut && (
                  <p className="text-sm text-success text-center mt-4 font-medium">
                    {plan.savings}
                  </p>
                )}
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
            <CreditCard className="h-4 w-4 text-primary" />
            30-day money-back guarantee
          </div>
        </div>
        
      </div>
      
      {/* Launch Promo Banner - Full Width - Uses separate promo tracking */}
      {launchPromo.promo_available && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-y border-amber-500/30 py-8 mt-16">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmYmYwMCIgZmlsbC1vcGFjaXR5PSIuMSIgY3g9IjIwIiBjeT0iMjAiIHI9IjIiLz48L2c+PC9zdmc+')] opacity-50" />
          <div className="container relative mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-bold uppercase tracking-wider text-amber-500">
                Launch Special
              </span>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              First {launchPromo.total_spots} customers get{" "}
              <span className="text-amber-500">{launchPromo.discount_percent}% OFF</span>
            </h3>
            <p className="text-muted-foreground mb-4">
              Lock in Pro Annual for just <span className="font-bold text-foreground">{launchPromo.promo_price}</span>{" "}
              <span className="line-through text-muted-foreground/60">$197</span> — one year of unlimited proposals
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400 font-semibold">
              <Clock className="h-4 w-4" />
              Only {launchPromo.spots_remaining} spots remaining!
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
