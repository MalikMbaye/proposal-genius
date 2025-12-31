import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, Circle, Loader2, Clock, Sparkles, Palette, Layout, FileCheck, Wand2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadingVideos, getContextSubtitle } from '@/lib/loadingContent';

interface DeckGeneratingLoaderProps {
  clientName?: string;
}

const stages = [
  { id: 1, label: 'Analyzing proposal', icon: Sparkles },
  { id: 2, label: 'Designing layouts', icon: Layout },
  { id: 3, label: 'Generating visuals', icon: Palette },
  { id: 4, label: 'Applying styling', icon: Wand2 },
  { id: 5, label: 'Finalizing deck', icon: FileCheck },
];

const tips = [
  "Your AI creates each slide with custom graphics and layouts",
  "Your presentation will include data visualizations where appropriate",
  "Professional design templates are applied automatically",
  "High-quality presentations take 5-7 minutes to generate",
  "Your deck will be exported as a downloadable PDF",
];

// Terminal simulation lines for deck generation
const deckTerminalLines = [
  "Parsing proposal structure...",
  "Extracting key value propositions...",
  "Analyzing content for slide breakdown...",
  "Generating slide layouts...",
  "Creating visual hierarchy...",
  "Rendering data visualizations...",
  "Applying brand styling...",
  "Optimizing slide transitions...",
  "Generating cover slide...",
  "Building pricing comparison charts...",
  "Rendering testimonial layouts...",
  "Finalizing slide deck structure...",
  "Exporting to PDF format...",
];

export function DeckGeneratingLoader({ clientName }: DeckGeneratingLoaderProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [currentTerminalLine, setCurrentTerminalLine] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get subtitle once
  const [subtitle] = useState(() => getContextSubtitle('slides'));

  // Current video and headline
  const currentVideo = loadingVideos[currentVideoIndex];
  const currentHeadline = currentVideo.headlines[0];

  // Force play video on mobile
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

  // Rotate videos every 8 seconds for deck generation (longer process)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % loadingVideos.length);
        setIsTransitioning(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Progress through stages with varying durations
    const durations = [8000, 15000, 20000, 15000, 10000];
    let totalTime = 0;
    const timeouts: NodeJS.Timeout[] = [];
    
    durations.forEach((duration, index) => {
      const timeout = setTimeout(() => {
        setCurrentStage(index);
      }, totalTime);
      timeouts.push(timeout);
      totalTime += duration;
    });

    return () => timeouts.forEach(t => clearTimeout(t));
  }, []);

  useEffect(() => {
    // Cycle through tips
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 6000);

    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    // Track elapsed time
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Terminal line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTerminalLine((prev) => {
        const nextLine = prev + 1;
        if (nextLine < deckTerminalLines.length) {
          setTerminalOutput((output) => [...output.slice(-5), deckTerminalLines[nextLine]]);
        }
        return nextLine >= deckTerminalLines.length ? 0 : nextLine;
      });
    }, 3000);

    // Initialize with first line
    setTerminalOutput([deckTerminalLines[0]]);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert stages to step format
  const steps = stages.map((stage, index) => ({
    label: stage.label,
    status: index < currentStage ? 'completed' as const : 
            index === currentStage ? 'active' as const : 'pending' as const
  }));

  // Calculate overall progress percentage based on stage
  const stageProgress = [0, 15, 40, 70, 90, 100];
  const baseProgress = stageProgress[currentStage] || 0;
  const nextProgress = stageProgress[currentStage + 1] || 100;
  const stageDurations = [8000, 15000, 20000, 15000, 10000];
  const currentStageDuration = stageDurations[currentStage] || 10000;
  
  // Smooth progress within current stage
  const [smoothProgress, setSmoothProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSmoothProgress((prev) => {
        const target = baseProgress + ((nextProgress - baseProgress) * 0.8);
        if (prev < target) {
          return Math.min(prev + 0.5, target);
        }
        return prev;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [baseProgress, nextProgress]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      <div className="flex flex-col items-center gap-5 animate-fade-in w-full max-w-3xl px-4">
        {/* Headline - rotates with video */}
        <div className="text-center space-y-2">
          <h2 
            className={cn(
              "text-2xl md:text-3xl font-bold text-foreground leading-tight transition-opacity duration-300",
              isTransitioning ? "opacity-0" : "opacity-100"
            )}
          >
            {currentHeadline}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {clientName ? `Building a stunning deck for ${clientName}` : subtitle}
          </p>
          <p className="text-muted-foreground/70 text-xs mt-1">
            Feel free to switch tabs — this takes 5-7 minutes. We'll keep working in the background.
          </p>
        </div>

        {/* Video Container */}
        <div className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50">
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
        </div>

        {/* Video indicator dots */}
        <div className="flex justify-center gap-1.5">
          {loadingVideos.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === currentVideoIndex 
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Progress Bar with Percentage */}
        <div className="w-full max-w-lg space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-mono font-semibold text-primary">{Math.round(smoothProgress)}%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${smoothProgress}%` }}
            />
            <div 
              className="absolute inset-y-0 left-0 bg-primary/30 rounded-full animate-pulse"
              style={{ width: `${smoothProgress}%` }}
            />
          </div>
        </div>

        {/* Sequential Steps Progress */}
        <div className="w-full max-w-lg">
          <div className="relative flex justify-between">
            {/* Progress line behind steps */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
            <div 
              className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
            />
            
            {steps.map((step, index) => {
              const StageIcon = stages[index].icon;
              return (
                <div key={step.label} className="relative flex flex-col items-center z-10">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                      step.status === "completed" && "bg-success border-success text-success-foreground",
                      step.status === "active" && "bg-primary border-primary text-primary-foreground",
                      step.status === "pending" && "bg-background border-muted text-muted-foreground"
                    )}
                  >
                    {step.status === "completed" ? (
                      <Check className="h-4 w-4" />
                    ) : step.status === "active" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <StageIcon className="h-4 w-4" />
                    )}
                  </div>
                  <span 
                    className={cn(
                      "text-xs mt-2 text-center max-w-16 leading-tight hidden md:block",
                      step.status === "completed" && "text-success",
                      step.status === "active" && "text-primary font-medium",
                      step.status === "pending" && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Mobile: show current step label */}
          <p className="text-center text-sm text-primary font-medium mt-4 md:hidden">
            {stages[currentStage].label}...
          </p>
        </div>

        {/* Terminal visualization */}
        <div className="w-full max-w-lg bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-b border-slate-700">
            <Terminal className="h-3.5 w-3.5 text-green-400" />
            <span className="text-xs text-slate-400 font-mono">Deck Generator</span>
            <div className="ml-auto flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
          </div>
          <div className="p-3 font-mono text-xs space-y-1 h-24 overflow-hidden">
            {terminalOutput.map((line, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "text-green-400 transition-opacity duration-300",
                  idx === terminalOutput.length - 1 ? "opacity-100" : "opacity-50"
                )}
              >
                <span className="text-slate-500">$</span> {line}
                {idx === terminalOutput.length - 1 && (
                  <span className="inline-block w-2 h-3.5 bg-green-400 ml-1 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
          <span className="text-muted-foreground/50">•</span>
          <span>Stage {currentStage + 1} of {stages.length}</span>
        </div>

        {/* Tips Carousel */}
        <div className="w-full max-w-md bg-muted/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground transition-opacity duration-500">
            💡 {tips[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}