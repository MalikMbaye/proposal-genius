import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  status: "pending" | "active" | "completed";
}

interface GeneratingLoaderProps {
  steps: Step[];
}

export function GeneratingLoader({ steps }: GeneratingLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        {/* Animated Ring */}
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin-slow" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-transparent animate-pulse" />
          <div className="absolute inset-0 rounded-full glow-primary opacity-50" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Generating your proposal package...</h2>
          <p className="mt-2 text-muted-foreground">Usually takes 30-60 seconds</p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {steps.map((step) => (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300",
                step.status === "active" && "bg-primary/10"
              )}
            >
              {step.status === "completed" ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success">
                  <Check className="h-4 w-4 text-success-foreground" />
                </div>
              ) : step.status === "active" ? (
                <div className="relative">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground/50" />
              )}
              <span
                className={cn(
                  "font-medium transition-colors",
                  step.status === "active" && "text-primary",
                  step.status === "pending" && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
