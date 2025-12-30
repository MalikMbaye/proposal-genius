import { useEffect, useRef } from "react";

interface LogoMarqueeProps {
  logos: string[];
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

export function LogoMarquee({ 
  logos, 
  direction = "left", 
  speed = "normal",
  className = "" 
}: LogoMarqueeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const speedDuration = {
    slow: "40s",
    normal: "25s",
    fast: "15s",
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <div 
        className="flex gap-12 md:gap-16"
        style={{
          animation: `scroll-${direction} ${speedDuration[speed]} linear infinite`,
        }}
      >
        {/* Double the logos for seamless loop */}
        {[...logos, ...logos].map((logo, index) => (
          <div
            key={`${logo}-${index}`}
            className="flex-shrink-0 text-lg md:text-xl font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors whitespace-nowrap"
          >
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
}

// Styled version with more prominent logos
export function BrandMarquee({ 
  logos, 
  direction = "left", 
  speed = "normal",
  variant = "muted"
}: LogoMarqueeProps & { variant?: "muted" | "bright" }) {
  const speedDuration = {
    slow: "45s",
    normal: "30s",
    fast: "18s",
  };

  const variantStyles = {
    muted: "text-muted-foreground/50 hover:text-muted-foreground/80",
    bright: "text-foreground/70 hover:text-foreground",
  };

  return (
    <div className="overflow-hidden">
      <div 
        className="flex items-center gap-10 md:gap-14"
        style={{
          animation: `scroll-${direction} ${speedDuration[speed]} linear infinite`,
        }}
      >
        {[...logos, ...logos].map((logo, index) => (
          <span
            key={`${logo}-${index}`}
            className={`flex-shrink-0 text-base md:text-lg font-bold tracking-wide uppercase whitespace-nowrap transition-colors duration-300 ${variantStyles[variant]}`}
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}
