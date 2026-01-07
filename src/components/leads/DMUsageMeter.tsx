import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Zap, TrendingUp, Infinity, Check } from 'lucide-react';
import { DM_TIERS } from '@/lib/dmSubscription';
import { cn } from '@/lib/utils';

interface DMUsageMeterProps {
  className?: string;
  compact?: boolean;
}

export function DMUsageMeter({ className, compact = false }: DMUsageMeterProps) {
  const { 
    dm_analyses_used, 
    dm_analyses_limit, 
    dm_tier,
    is_pitchgenius_customer,
    openCheckout,
    loading 
  } = useSubscription();
  
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const isUnlimited = dm_tier === 'unlimited';
  const usagePercent = isUnlimited ? 0 : Math.min((dm_analyses_used / dm_analyses_limit) * 100, 100);
  const remaining = Math.max(dm_analyses_limit - dm_analyses_used, 0);
  const isAtLimit = dm_analyses_used >= dm_analyses_limit && !isUnlimited;
  const isNearLimit = usagePercent >= 80 && !isUnlimited;

  const currentTierName = dm_tier 
    ? DM_TIERS[dm_tier].name 
    : 'Free';

  const handleUpgradeClick = async (tier: 'dm_starter' | 'dm_growth' | 'dm_unlimited') => {
    try {
      setCheckoutLoading(tier);
      await openCheckout(tier);
    } finally {
      setCheckoutLoading(null);
      setUpgradeModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className={cn("animate-pulse bg-muted rounded-lg h-12", className)} />
    );
  }

  // Compact variant for header/sidebar
  if (compact) {
    return (
      <>
        <button
          onClick={() => isAtLimit && setUpgradeModalOpen(true)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all",
            isAtLimit 
              ? "bg-destructive/20 text-destructive hover:bg-destructive/30 cursor-pointer" 
              : isNearLimit 
                ? "bg-amber-500/20 text-amber-400"
                : "bg-muted text-muted-foreground",
            className
          )}
        >
          <Zap className="h-3.5 w-3.5" />
          {isUnlimited ? (
            <span className="flex items-center gap-1">
              <Infinity className="h-3.5 w-3.5" />
              <span>Unlimited</span>
            </span>
          ) : (
            <span>{dm_analyses_used}/{dm_analyses_limit}</span>
          )}
        </button>

        <UpgradeModal 
          open={upgradeModalOpen}
          onOpenChange={setUpgradeModalOpen}
          currentTier={dm_tier}
          analysesUsed={dm_analyses_used}
          analysesLimit={dm_analyses_limit}
          isPitchGeniusCustomer={is_pitchgenius_customer}
          onUpgrade={handleUpgradeClick}
          checkoutLoading={checkoutLoading}
        />
      </>
    );
  }

  // Full variant
  return (
    <>
      <Card className={cn(
        "p-4 border transition-all",
        isAtLimit 
          ? "border-destructive/50 bg-destructive/5" 
          : isNearLimit 
            ? "border-amber-500/50 bg-amber-500/5"
            : "border-border",
        className
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className={cn(
              "h-4 w-4",
              isAtLimit ? "text-destructive" : isNearLimit ? "text-amber-400" : "text-primary"
            )} />
            <span className="text-sm font-medium">DM Analyses</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {currentTierName}
            </span>
          </div>
          
          {!isUnlimited && (
            <span className={cn(
              "text-sm font-medium",
              isAtLimit ? "text-destructive" : isNearLimit ? "text-amber-400" : "text-foreground"
            )}>
              {dm_analyses_used} / {dm_analyses_limit}
            </span>
          )}
          
          {isUnlimited && (
            <span className="text-sm font-medium text-primary flex items-center gap-1">
              <Infinity className="h-4 w-4" />
              Unlimited
            </span>
          )}
        </div>

        {!isUnlimited && (
          <Progress 
            value={usagePercent} 
            className={cn(
              "h-2",
              isAtLimit && "[&>div]:bg-destructive",
              isNearLimit && !isAtLimit && "[&>div]:bg-amber-500"
            )}
          />
        )}

        {isAtLimit ? (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-destructive">
              You've used all {dm_analyses_limit} free analyses this month
            </span>
            <Button 
              size="sm" 
              onClick={() => setUpgradeModalOpen(true)}
              className="gap-1"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Upgrade
            </Button>
          </div>
        ) : isNearLimit ? (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-amber-400">
              {remaining} analyses remaining
            </span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setUpgradeModalOpen(true)}
              className="gap-1 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            >
              Upgrade for more →
            </Button>
          </div>
        ) : !isUnlimited && remaining > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {remaining} analyses remaining this month
          </p>
        )}
      </Card>

      <UpgradeModal 
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        currentTier={dm_tier}
        analysesUsed={dm_analyses_used}
        analysesLimit={dm_analyses_limit}
        isPitchGeniusCustomer={is_pitchgenius_customer}
        onUpgrade={handleUpgradeClick}
        checkoutLoading={checkoutLoading}
      />
    </>
  );
}

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTier: 'starter' | 'growth' | 'unlimited' | null;
  analysesUsed: number;
  analysesLimit: number;
  isPitchGeniusCustomer: boolean;
  onUpgrade: (tier: 'dm_starter' | 'dm_growth' | 'dm_unlimited') => void;
  checkoutLoading: string | null;
}

function UpgradeModal({ 
  open, 
  onOpenChange, 
  currentTier, 
  analysesUsed, 
  analysesLimit,
  isPitchGeniusCustomer,
  onUpgrade,
  checkoutLoading 
}: UpgradeModalProps) {
  const tiers = [
    { key: 'starter' as const, tier: DM_TIERS.starter, checkoutKey: 'dm_starter' as const },
    { key: 'growth' as const, tier: DM_TIERS.growth, checkoutKey: 'dm_growth' as const },
    { key: 'unlimited' as const, tier: DM_TIERS.unlimited, checkoutKey: 'dm_unlimited' as const },
  ];

  const currentTierIndex = currentTier ? tiers.findIndex(t => t.key === currentTier) : -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription>
            You've used {analysesUsed}/{analysesLimit} analyses this month. Upgrade for more.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {tiers.map(({ key, tier, checkoutKey }, index) => {
            const isCurrentTier = currentTier === key;
            const isDowngrade = index < currentTierIndex;
            const price = isPitchGeniusCustomer && key === 'growth' && tier.pitchgeniusPrice
              ? tier.pitchgeniusPriceDisplay
              : tier.priceDisplay;

            return (
              <div
                key={key}
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  isCurrentTier 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{tier.name}</span>
                    {isCurrentTier && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{price}</span>
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                    {isPitchGeniusCustomer && key === 'growth' && tier.pitchgeniusPrice && (
                      <p className="text-xs text-primary">PitchGenius discount!</p>
                    )}
                  </div>
                </div>

                <ul className="space-y-1 mb-3">
                  {tier.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {!isCurrentTier && !isDowngrade && (
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => onUpgrade(checkoutKey)}
                    disabled={checkoutLoading !== null}
                  >
                    {checkoutLoading === checkoutKey ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      `Upgrade to ${tier.name}`
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
