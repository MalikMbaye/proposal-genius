import { useEffect, useState } from 'react';
import { X, Lightbulb, Target, DollarSign, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TourContent } from '@/hooks/useFirstVisitTour';
import { cn } from '@/lib/utils';

interface TourTooltipProps {
  content: TourContent;
  onDismiss: () => void;
  tabIcon?: React.ReactNode;
}

export function TourTooltip({ content, onDismiss, tabIcon }: TourTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in after a brief delay
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isVisible && !isExiting ? "opacity-100" : "opacity-0"
        )}
        onClick={handleDismiss}
      />

      {/* Tour Modal */}
      <div 
        className={cn(
          "fixed z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[90vw] max-w-lg",
          "bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900",
          "border border-slate-600/50 rounded-2xl shadow-2xl",
          "transition-all duration-300 ease-out",
          isVisible && !isExiting 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95"
        )}
      >
        {/* Header with gradient accent */}
        <div className="relative p-6 pb-4">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-t-2xl" />
          
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Title with icon */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              {tabIcon || <Sparkles className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wider">First Time Here?</p>
              <h2 className="text-xl font-bold text-white">{content.title}</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Description */}
          <p className="text-slate-300 leading-relaxed">
            {content.description}
          </p>

          {/* Info Cards */}
          <div className="space-y-3">
            {/* Pitch Kit Role */}
            <div className="flex gap-3 p-3 rounded-lg bg-slate-700/50 border border-slate-600/30">
              <div className="flex-shrink-0 mt-0.5">
                <Target className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">
                  In Your Pitch Kit
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {content.pitchKitRole}
                </p>
              </div>
            </div>

            {/* Why You Need It */}
            <div className="flex gap-3 p-3 rounded-lg bg-slate-700/50 border border-slate-600/30">
              <div className="flex-shrink-0 mt-0.5">
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">
                  Why You Need It
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {content.whyYouNeedIt}
                </p>
              </div>
            </div>

            {/* Pro Tip */}
            {content.proTip && (
              <div className="flex gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex-shrink-0 mt-0.5">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1">
                    Pro Tip
                  </p>
                  <p className="text-sm text-amber-200/90 leading-relaxed">
                    {content.proTip}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleDismiss}
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            Got it, let's go!
          </Button>

          {/* Subtle footer note */}
          <p className="text-center text-xs text-slate-500">
            You won't see this again for this section
          </p>
        </div>
      </div>
    </>
  );
}
