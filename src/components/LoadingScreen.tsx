import { useEffect, useState, useMemo } from "react";
import { Check, Circle, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRandomLoadingContent, getContextSubtitle } from "@/lib/loadingContent";

export interface LoadingStep {
  label: string;
  status: "pending" | "active" | "completed";
}

export interface LoadingScreenProps {
  context: "proposal" | "slides" | "contract" | "invoice" | "full-package";
  steps?: LoadingStep[];
  showMetrics?: boolean;
  tokensUsed?: number;
  charCount?: number;
  timeElapsed?: number;
  progress?: number;
  manusVisualization?: React.ReactNode;
}

export function LoadingScreen({
  context,
  steps = [],
  showMetrics = true,
  tokensUsed,
  charCount,
  timeElapsed = 0,
  progress = 0,
  manusVisualization,
}: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(timeElapsed);

  // Select random video + headline on mount (memoized to prevent re-selection)
  const { videoUrl, headline } = useMemo(() => getRandomLoadingContent(), []);
  const subtitle = useMemo(() => getContextSubtitle(context), [context]);

  // Smooth progress animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayProgress < progress) {
        setDisplayProgress((prev) => Math.min(prev + 1, progress));
      }
    }, 20);
    return () => clearTimeout(timer);
  }, [displayProgress, progress]);

  // Timer for elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      <div className="flex flex-col items-center gap-6 animate-fade-in w-full max-w-2xl px-4">
        {/* Headline */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {headline}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">{subtitle}</p>
        </div>

        {/* Video Container */}
        <div className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50">
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
          
          {/* Progress overlay */}
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/50">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Steps */}
        {steps.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {steps.map((step, index) => (
              <div
                key={step.label}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-all duration-300",
                  step.status === "completed" && "bg-success/20 text-success",
                  step.status === "active" && "bg-primary/20 text-primary",
                  step.status === "pending" && "bg-muted text-muted-foreground"
                )}
              >
                {step.status === "completed" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : step.status === "active" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Circle className="h-3.5 w-3.5" />
                )}
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Metrics */}
        {showMetrics && (
          <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            {charCount !== undefined && charCount > 0 && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="font-mono">{charCount.toLocaleString()} chars</span>
              </>
            )}
            {tokensUsed !== undefined && tokensUsed > 0 && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="font-mono">{tokensUsed.toLocaleString()} tokens</span>
              </>
            )}
            {progress > 0 && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="font-mono">{displayProgress}%</span>
              </>
            )}
          </div>
        )}

        {/* Manus Visualization (if provided) */}
        {manusVisualization && (
          <div className="w-full mt-2">
            {manusVisualization}
          </div>
        )}
      </div>
    </div>
  );
}
