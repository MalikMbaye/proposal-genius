import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  completed: boolean;
  active: boolean;
}

interface ProgressStepperProps {
  steps: Step[];
}

export function ProgressStepper({ steps }: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-xs md:max-w-md mx-auto">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <div
              className={cn(
                "relative flex h-7 w-7 md:h-10 md:w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                step.completed && "border-primary bg-primary",
                step.active && !step.completed && "border-primary bg-transparent animate-glow-pulse",
                !step.active && !step.completed && "border-muted bg-transparent"
              )}
            >
              {step.completed ? (
                <Check className="h-3.5 w-3.5 md:h-5 md:w-5 text-primary-foreground" />
              ) : (
                <span
                  className={cn(
                    "text-xs md:text-sm font-medium",
                    step.active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {index + 1}
                </span>
              )}
              {step.active && !step.completed && (
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
              )}
            </div>
            <span
              className={cn(
                "text-[10px] md:text-sm font-medium transition-colors whitespace-nowrap",
                step.active || step.completed ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 flex-1 mx-2 md:mx-4 transition-colors duration-300",
                step.completed ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
