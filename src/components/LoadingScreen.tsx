import { useEffect, useState, useCallback, useRef } from "react";
import { Check, Circle, Loader2, Clock, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadingVideos, getContextSubtitle } from "@/lib/loadingContent";

export interface LoadingStep {
  label: string;
  status: "pending" | "active" | "completed";
}

export interface LoadingScreenProps {
  context: "proposal" | "slides" | "contract" | "invoice" | "email" | "full-package";
  steps?: LoadingStep[];
  showMetrics?: boolean;
  tokensUsed?: number;
  charCount?: number;
  timeElapsed?: number;
  progress?: number;
  extraVisualization?: React.ReactNode;
  showTerminal?: boolean;
}

// Simulated AI terminal output lines
const terminalLines = [
  "Initializing proposal engine...",
  "Loading client context analysis module...",
  "Parsing industry benchmarks...",
  "Analyzing competitive positioning...",
  "Generating value propositions...",
  "Structuring pricing tiers...",
  "Crafting executive summary...",
  "Optimizing language for conversion...",
  "Applying persuasion frameworks...",
  "Validating proposal structure...",
  "Refining key differentiators...",
  "Calculating ROI projections...",
  "Polishing final deliverable...",
];

export function LoadingScreen({
  context,
  steps = [],
  showMetrics = true,
  tokensUsed,
  charCount,
  timeElapsed = 0,
  progress = 0,
  extraVisualization,
  showTerminal = true,
}: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(timeElapsed);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [currentTerminalLine, setCurrentTerminalLine] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get subtitle once on mount
  const [subtitle] = useState(() => getContextSubtitle(context));

  // Current video and headline
  const currentVideo = loadingVideos[currentVideoIndex];
  const currentHeadline = currentVideo.headlines[0];

  // Force play video on mobile - must be called after user interaction or on mount
  const forcePlayVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Video autoplay blocked, will retry on interaction:", err);
      });
    }
  }, []);

  // Play video when it loads or changes
  useEffect(() => {
    forcePlayVideo();
  }, [currentVideoIndex, forcePlayVideo]);

  // Also try to play on any touch/click (for mobile browsers that block initial autoplay)
  useEffect(() => {
    const handleInteraction = () => {
      forcePlayVideo();
    };
    
    document.addEventListener("touchstart", handleInteraction, { once: true });
    document.addEventListener("click", handleInteraction, { once: true });
    
    return () => {
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };
  }, [forcePlayVideo]);

  // Rotate videos every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % loadingVideos.length);
        setIsTransitioning(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

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

  // Terminal line animation
  useEffect(() => {
    if (!showTerminal) return;
    
    const interval = setInterval(() => {
      setCurrentTerminalLine((prev) => {
        const nextLine = prev + 1;
        if (nextLine < terminalLines.length) {
          setTerminalOutput((output) => [...output.slice(-5), terminalLines[nextLine]]);
        }
        return nextLine >= terminalLines.length ? 0 : nextLine;
      });
    }, 2500);

    // Initialize with first line
    setTerminalOutput([terminalLines[0]]);

    return () => clearInterval(interval);
  }, [showTerminal]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col items-center gap-3 md:gap-5 animate-fade-in w-full max-w-3xl px-3 md:px-4 py-4 md:py-0 min-h-screen md:min-h-0 justify-center">
        {/* Headline - rotates with video */}
        <div className="text-center space-y-1 md:space-y-2">
          <h2 
            className={cn(
              "text-xl md:text-3xl font-bold text-foreground leading-tight transition-opacity duration-300",
              isTransitioning ? "opacity-0" : "opacity-100"
            )}
          >
            {currentHeadline}
          </h2>
          <p className="text-muted-foreground text-xs md:text-base">{subtitle}</p>
        </div>

        {/* Video Container - Responsive */}
        <div className="relative w-full max-w-sm md:max-w-lg aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl border border-border/50">
          <video
            ref={videoRef}
            key={currentVideo.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onCanPlay={forcePlayVideo}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isTransitioning ? "opacity-0" : "opacity-100"
            )}
          >
            <source src={currentVideo.videoUrl} type="video/mp4" />
          </video>
          
          {/* Progress overlay */}
          {progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 md:h-1.5 bg-muted/50">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Video indicator dots */}
        <div className="flex justify-center gap-1 md:gap-1.5">
          {loadingVideos.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1 md:h-1.5 rounded-full transition-all duration-300",
                index === currentVideoIndex 
                  ? "w-4 md:w-6 bg-primary"
                  : "w-1 md:w-1.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Steps - Scrollable on mobile */}
        {steps.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 px-2">
            {steps.map((step) => (
              <div
                key={step.label}
                className={cn(
                  "flex items-center gap-1.5 md:gap-2 rounded-full px-2.5 py-1 md:px-4 md:py-2 text-[10px] md:text-sm font-medium transition-all duration-300",
                  step.status === "completed" && "bg-success/20 text-success",
                  step.status === "active" && "bg-primary/20 text-primary",
                  step.status === "pending" && "bg-muted text-muted-foreground"
                )}
              >
                {step.status === "completed" ? (
                  <Check className="h-3 w-3 md:h-3.5 md:w-3.5" />
                ) : step.status === "active" ? (
                  <Loader2 className="h-3 w-3 md:h-3.5 md:w-3.5 animate-spin" />
                ) : (
                  <Circle className="h-3 w-3 md:h-3.5 md:w-3.5" />
                )}
                <span className="whitespace-nowrap">{step.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Terminal visualization - Hidden on very small screens */}
        {showTerminal && (
          <div className="w-full max-w-sm md:max-w-lg bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-lg hidden xs:block">
            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-slate-800 border-b border-slate-700">
              <Terminal className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-400" />
              <span className="text-[10px] md:text-xs text-slate-400 font-mono">AI Agent</span>
              <div className="ml-auto flex gap-0.5 md:gap-1">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500/60" />
              </div>
            </div>
            <div className="p-2 md:p-3 font-mono text-[10px] md:text-xs space-y-0.5 md:space-y-1 h-16 md:h-24 overflow-hidden">
              {terminalOutput.map((line, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "text-green-400 transition-opacity duration-300 truncate",
                    idx === terminalOutput.length - 1 ? "opacity-100" : "opacity-50"
                  )}
                >
                  <span className="text-slate-500">$</span> {line}
                  {idx === terminalOutput.length - 1 && (
                    <span className="inline-block w-1.5 md:w-2 h-2.5 md:h-3.5 bg-green-400 ml-1 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        {showMetrics && (
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[10px] md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1 md:gap-1.5">
              <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
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

        {/* Extra Visualization (if provided) */}
        {extraVisualization && (
          <div className="w-full mt-2">
            {extraVisualization}
          </div>
        )}
      </div>
    </div>
  );
}