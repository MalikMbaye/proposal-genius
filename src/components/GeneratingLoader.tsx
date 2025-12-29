import { Check, Circle, Loader2, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Step {
  label: string;
  status: "pending" | "active" | "completed";
}

interface GeneratingLoaderProps {
  steps: Step[];
  progress?: number;
  charCount?: number;
  streamingContent?: string;
  showPreview?: boolean;
}

export function GeneratingLoader({ 
  steps, 
  progress = 0, 
  charCount = 0,
  streamingContent = '',
  showPreview = false 
}: GeneratingLoaderProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  // Smooth progress animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayProgress < progress) {
        setDisplayProgress(prev => Math.min(prev + 1, progress));
      }
    }, 20);
    return () => clearTimeout(timer);
  }, [displayProgress, progress]);

  // Show content after a delay
  useEffect(() => {
    if (streamingContent.length > 100) {
      setShowContent(true);
    }
  }, [streamingContent]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      <div className="flex flex-col items-center gap-6 animate-fade-in w-full max-w-2xl px-4">
        {/* Progress Ring */}
        <div className="relative h-28 w-28">
          {/* Background ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="56"
              cy="56"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="text-primary transition-all duration-300"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - displayProgress / 100)}`}
            />
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{displayProgress}%</span>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full glow-primary opacity-30 animate-pulse" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            Writing your proposal...
          </h2>
          <p className="mt-2 text-muted-foreground">
            {charCount > 0 ? (
              <span className="font-mono">{charCount.toLocaleString()} characters written</span>
            ) : (
              'Initializing AI...'
            )}
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {steps.map((step) => (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-300",
                step.status === "active" && "bg-primary/10"
              )}
            >
              {step.status === "completed" ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success">
                  <Check className="h-3 w-3 text-success-foreground" />
                </div>
              ) : step.status === "active" ? (
                <div className="relative">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/50" />
              )}
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  step.status === "active" && "text-primary",
                  step.status === "pending" && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Live Preview */}
        {showPreview && showContent && streamingContent && (
          <div className="w-full mt-4 rounded-xl border border-border bg-card/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Live Preview</span>
            </div>
            <div className="p-4 max-h-40 overflow-hidden relative">
              <p className="text-sm text-muted-foreground line-clamp-6 whitespace-pre-wrap">
                {streamingContent.slice(-500)}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/50 to-transparent" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
