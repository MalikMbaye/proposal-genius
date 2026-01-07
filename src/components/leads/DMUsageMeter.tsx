import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Progress } from '@/components/ui/progress';
import { Zap, Infinity } from 'lucide-react';
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
    loading 
  } = useSubscription();

  const isUnlimited = dm_tier === 'unlimited';
  const usagePercent = isUnlimited ? 0 : Math.min((dm_analyses_used / dm_analyses_limit) * 100, 100);
  const remaining = Math.max(dm_analyses_limit - dm_analyses_used, 0);

  if (loading) {
    return (
      <div className={cn("animate-pulse bg-muted rounded-lg h-10", className)} />
    );
  }

  // Compact variant - just show simple usage, no warnings or upsells
  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-muted text-muted-foreground",
        className
      )}>
        <Zap className="h-3.5 w-3.5" />
        {isUnlimited ? (
          <span className="flex items-center gap-1">
            <Infinity className="h-3.5 w-3.5" />
            <span>Unlimited</span>
          </span>
        ) : (
          <span>{dm_analyses_used}/{dm_analyses_limit} used</span>
        )}
      </div>
    );
  }

  // Full variant - simple usage display, no aggressive upselling
  return (
    <div className={cn(
      "p-4 rounded-lg border border-border bg-card/50",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">DM Analyses</span>
        </div>
        
        {isUnlimited ? (
          <span className="text-sm font-medium text-primary flex items-center gap-1">
            <Infinity className="h-4 w-4" />
            Unlimited
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">
            {dm_analyses_used} / {dm_analyses_limit}
          </span>
        )}
      </div>

      {!isUnlimited && (
        <>
          <Progress value={usagePercent} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-2">
            {remaining > 0 ? `${remaining} analyses remaining` : 'No analyses remaining'}
          </p>
        </>
      )}
    </div>
  );
}
