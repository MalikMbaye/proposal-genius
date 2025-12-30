import { useState, useEffect } from 'react';
import { Loader2, Sparkles, Palette, Layout, FileCheck, Wand2 } from 'lucide-react';

interface DeckGeneratingLoaderProps {
  clientName?: string;
}

const stages = [
  { id: 1, label: 'Analyzing your proposal', icon: Sparkles, duration: 8000 },
  { id: 2, label: 'Designing slide layouts', icon: Layout, duration: 15000 },
  { id: 3, label: 'Generating visuals & graphics', icon: Palette, duration: 20000 },
  { id: 4, label: 'Applying professional styling', icon: Wand2, duration: 15000 },
  { id: 5, label: 'Finalizing your deck', icon: FileCheck, duration: 10000 },
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

  useEffect(() => {
    // Progress through stages
    let stageTimeout: NodeJS.Timeout;
    let totalTime = 0;
    
    stages.forEach((stage, index) => {
      stageTimeout = setTimeout(() => {
        setCurrentStage(index);
      }, totalTime);
      totalTime += stage.duration;
    });

    return () => clearTimeout(stageTimeout);
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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-8 md:p-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Creating Your Presentation</h2>
        <p className="text-muted-foreground">
          {clientName ? `Building a stunning deck for ${clientName}` : 'Manus AI is designing your slides'}
        </p>
      </div>

      {/* Progress Stages */}
      <div className="max-w-md mx-auto mb-8">
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index === currentStage;
            const isComplete = index < currentStage;
            const isPending = index > currentStage;

            return (
              <div
                key={stage.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                  isActive
                    ? 'bg-primary/10 border border-primary/20'
                    : isComplete
                    ? 'bg-muted/50 opacity-60'
                    : 'opacity-40'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isComplete
                      ? 'bg-muted-foreground/20 text-muted-foreground'
                      : 'bg-muted text-muted-foreground/50'
                  }`}
                >
                  {isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? 'text-foreground'
                      : isComplete
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/50'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm">
          <span className="text-muted-foreground">Elapsed time:</span>
          <span className="font-mono font-medium">{formatTime(elapsedTime)}</span>
        </div>
      </div>

      {/* Tips Carousel */}
      <div className="bg-muted/30 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground transition-opacity duration-500">
          💡 {tips[tipIndex]}
        </p>
      </div>

      {/* Bouncing Dots */}
      <div className="flex justify-center gap-1 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
