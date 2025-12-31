import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showIcon?: boolean;
  variant?: "default" | "light";
}

export function Logo({ className, showIcon = true, variant = "default" }: LogoProps) {
  const isLight = variant === "light";
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent-secondary opacity-80" />
          <div className={cn(
            "absolute inset-[2px] rounded-[6px] flex items-center justify-center",
            isLight ? "bg-slate-900" : "bg-background"
          )}>
            <span className="text-primary font-bold text-lg">P</span>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        <span className={cn(
          "text-xl font-bold tracking-tight leading-tight",
          isLight ? "text-white" : "text-foreground"
        )}>
          Pitch<span className="text-primary font-normal">Genius</span>
        </span>
        <span className={cn(
          "text-[9px] tracking-wide leading-none",
          isLight ? "text-white/60" : "text-muted-foreground/70"
        )}>
          by Black Lotus Ventures
        </span>
      </div>
    </div>
  );
}
