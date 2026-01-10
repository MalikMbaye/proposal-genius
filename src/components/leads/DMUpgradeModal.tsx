import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Zap, Check, Sparkles, TrendingUp, MessageSquare, Target } from 'lucide-react';
import { DM_TIERS, BillingInterval, getDMCheckoutKey } from '@/lib/dmSubscription';
import { cn } from '@/lib/utils';

interface DMUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DMUpgradeModal({ open, onOpenChange }: DMUpgradeModalProps) {
  const { 
    dm_analyses_used, 
    dm_analyses_limit, 
    dm_tier,
    is_pitchgenius_customer,
    openCheckout 
  } = useSubscription();
  
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');

  const handleUpgrade = async (tier: 'starter' | 'growth' | 'unlimited') => {
    const checkoutKey = getDMCheckoutKey(tier, billingInterval);
    try {
      setCheckoutLoading(checkoutKey);
      await openCheckout(checkoutKey as any);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const tiers = [
    { key: 'starter' as const, tier: DM_TIERS.starter, popular: false },
    { key: 'growth' as const, tier: DM_TIERS.growth, popular: true },
    { key: 'unlimited' as const, tier: DM_TIERS.unlimited, popular: false },
  ];

  const currentTierIndex = dm_tier ? tiers.findIndex(t => t.key === dm_tier) : -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">
            You're Loving the DM Assistant! 🔥
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            You've used all {dm_analyses_limit} free analyses this month. 
            Upgrade to keep closing deals with AI-powered responses.
          </DialogDescription>
        </DialogHeader>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center p-1 bg-muted rounded-lg">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                billingInterval === 'monthly'
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                billingInterval === 'annual'
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
              <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Benefits reminder */}
        <div className="grid grid-cols-3 gap-3 py-4 border-y border-border">
          <div className="text-center">
            <MessageSquare className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">AI Response Coaching</p>
          </div>
          <div className="text-center">
            <Target className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Lead Scoring</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Close More Deals</p>
          </div>
        </div>

        {/* Pricing tiers */}
        <div className="space-y-3 my-4">
          {tiers.map(({ key, tier, popular }, index) => {
            const isCurrentTier = dm_tier === key;
            const isDowngrade = index < currentTierIndex;
            const pricing = billingInterval === 'annual' ? tier.annual : tier.monthly;
            
            // PitchGenius discount only applies to monthly growth
            const price = is_pitchgenius_customer && key === 'growth' && billingInterval === 'monthly' && 'pitchgeniusPriceDisplay' in tier.monthly
              ? tier.monthly.pitchgeniusPriceDisplay
              : pricing.priceDisplay;

            const checkoutKey = getDMCheckoutKey(key, billingInterval);

            return (
              <div
                key={key}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all",
                  popular && !isCurrentTier
                    ? "border-primary bg-primary/5 shadow-lg" 
                    : isCurrentTier 
                      ? "border-primary/50 bg-primary/5" 
                      : "border-border hover:border-primary/30"
                )}
              >
                {popular && !isCurrentTier && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    MOST POPULAR
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{tier.name}</span>
                      {isCurrentTier && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {tier.analyses_limit === 999999 ? 'Unlimited' : tier.analyses_limit} analyses/month
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{price}</span>
                      <span className="text-sm text-muted-foreground">
                        {billingInterval === 'annual' ? '/year' : '/month'}
                      </span>
                    </div>
                    {billingInterval === 'annual' && 'savings' in tier.annual && (
                      <p className="text-xs text-primary font-medium">
                        {tier.annual.savings}
                      </p>
                    )}
                    {billingInterval === 'monthly' && is_pitchgenius_customer && key === 'growth' && 'pitchgeniusPrice' in tier.monthly && (
                      <p className="text-xs text-primary font-medium">
                        PitchGenius member discount!
                      </p>
                    )}
                  </div>
                </div>

                <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-3 mb-4">
                  {tier.features.slice(0, 4).map((feature, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                      <Check className="h-3 w-3 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {!isCurrentTier && !isDowngrade && (
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant={popular ? "default" : "outline"}
                    onClick={() => handleUpgrade(key)}
                    disabled={checkoutLoading !== null}
                  >
                    {checkoutLoading === checkoutKey ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      `Get ${tier.name}`
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Cancel anytime. Your analyses reset at the start of each billing cycle.
        </p>
      </DialogContent>
    </Dialog>
  );
}