import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showIcon?: boolean;
}

export function Logo({ className, showIcon = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent-secondary opacity-80" />
          <div className="absolute inset-[2px] rounded-[6px] bg-background flex items-center justify-center">
            <span className="text-primary font-bold text-lg">P</span>
          </div>
        </div>
      )}
      <span className="text-xl font-bold tracking-tight">
        Pitch<span className="text-primary font-normal">Genius</span>
      </span>
    </div>
  );
}
