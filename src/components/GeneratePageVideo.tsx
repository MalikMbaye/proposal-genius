import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { getRandomLoadingContent } from '@/lib/loadingContent';

interface GeneratePageVideoProps {
  step?: number;
}

const stepMessages = [
  "Let's build something amazing together",
  "Great info! Your proposal is taking shape",
  "Almost there—this is going to be good",
];

export function GeneratePageVideo({ step = 1 }: GeneratePageVideoProps) {
  // Get a random video on mount
  const { videoUrl } = useMemo(() => getRandomLoadingContent(), []);
  const message = stepMessages[step - 1] || stepMessages[0];

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
      {/* Video */}
      <div className="aspect-video relative">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>
      
      {/* Message */}
      <div className="p-4 -mt-8 relative">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Step {step} of 3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
