import { useState, useEffect, useMemo } from 'react';
import { Check, Circle, Loader2, Clock, Sparkles, Palette, Layout, FileCheck, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRandomLoadingContent, getContextSubtitle } from '@/lib/loadingContent';

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
  "Manus AI creates each slide with custom graphics and layouts",
  "Your presentation will include data visualizations where appropriate",
  "Professional design templates are applied automatically",
  "High-quality presentations typically take 2-5 minutes to generate",
  "Your deck will be exported as a downloadable PDF",
];

export function DeckGeneratingLoader({ clientName }: DeckGeneratingLoaderProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Select random video + headline on mount
  const { videoUrl, headline } = useMemo(() => getRandomLoadingContent(), []);
  const subtitle = useMemo(() => getContextSubtitle('slides'), []);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      <div className="flex flex-col items-center gap-6 animate-fade-in w-full max-w-2xl px-4">
        {/* Headline */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {headline}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {clientName ? `Building a stunning deck for ${clientName}` : subtitle}
          </p>
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
        </div>

        {/* Steps */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {steps.map((step) => (
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
