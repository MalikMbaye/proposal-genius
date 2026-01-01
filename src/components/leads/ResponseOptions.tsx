import { useState } from 'react';
import { Check, Copy, MessageSquare, Target, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { DMAnalysis } from './ScreenshotDropZone';

interface ResponseOptionsProps {
  analysis: DMAnalysis;
  className?: string;
}

const optionConfig = {
  A: { icon: MessageSquare, label: 'Direct', color: 'border-blue-500/30 hover:border-blue-500/60' },
  B: { icon: Target, label: 'Consultative', color: 'border-purple-500/30 hover:border-purple-500/60' },
  C: { icon: Trophy, label: 'Social Proof', color: 'border-orange-500/30 hover:border-orange-500/60' },
};

export function ResponseOptions({ analysis, className }: ResponseOptionsProps) {
  const [copiedOption, setCopiedOption] = useState<string | null>(null);

  const handleCopy = async (option: 'A' | 'B' | 'C') => {
    const message = analysis.response_options[option].message;
    await navigator.clipboard.writeText(message);
    setCopiedOption(option);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedOption(null), 2000);
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {(['A', 'B', 'C'] as const).map((option) => {
          const opt = analysis.response_options[option];
          const isRecommended = analysis.recommended === option;
          const config = optionConfig[option];
          const Icon = config.icon;

          return (
            <div
              key={option}
              className={cn(
                'p-4 rounded-xl border-2 bg-card transition-all',
                config.color,
                isRecommended && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm uppercase tracking-wide">
                    {opt.type || config.label}
                  </span>
                  {isRecommended && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                      <Sparkles className="h-3 w-3" />
                      Recommended
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(option)}
                  className="gap-2"
                >
                  {copiedOption === option ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-foreground leading-relaxed">{opt.message}</p>
            </div>
          );
        })}
      </div>

      {analysis.reasoning && (
        <p className="mt-4 text-sm text-muted-foreground italic flex items-start gap-2">
          <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />
          {analysis.reasoning}
        </p>
      )}

      {analysis.next_action && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm">
            <span className="font-medium text-foreground">Next:</span>{' '}
            <span className="text-muted-foreground">{analysis.next_action}</span>
          </p>
        </div>
      )}
    </div>
  );
}
