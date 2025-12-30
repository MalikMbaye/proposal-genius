import { useState, useEffect, useMemo } from 'react';
import { getRandomLoadingContent } from '@/lib/loadingContent';

interface VideoHeroDisplayProps {
  /** Size variant */
  variant?: 'default' | 'large' | 'fullscreen';
  /** Whether to show the headline */
  showHeadline?: boolean;
  /** Custom headline override */
  customHeadline?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to rotate through videos (every 15s) */
  rotate?: boolean;
}

export function VideoHeroDisplay({
  variant = 'default',
  showHeadline = true,
  customHeadline,
  className = '',
  rotate = false,
}: VideoHeroDisplayProps) {
  const [content, setContent] = useState(() => getRandomLoadingContent());

  // Optional rotation every 15 seconds
  useEffect(() => {
    if (!rotate) return;
    
    const interval = setInterval(() => {
      setContent(getRandomLoadingContent());
    }, 15000);

    return () => clearInterval(interval);
  }, [rotate]);

  const sizeClasses = {
    default: 'max-w-md aspect-video',
    large: 'max-w-2xl aspect-video',
    fullscreen: 'w-full h-[60vh] md:h-[70vh]',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Headline */}
      {showHeadline && (
        <div className="text-center mb-6 animate-fade-in">
          <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
            {customHeadline || content.headline}
          </h3>
        </div>
      )}

      {/* Video Container */}
      <div className={`relative ${sizeClasses[variant]} rounded-2xl overflow-hidden shadow-2xl border border-border/30 mx-auto group`}>
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent-secondary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
        
        <div className="relative w-full h-full">
          <video
            key={content.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src={content.videoUrl} type="video/mp4" />
          </video>

          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
