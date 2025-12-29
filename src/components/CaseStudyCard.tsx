import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseStudyCardProps {
  title: string;
  description: string;
  selected: boolean;
  onToggle: () => void;
}

export function CaseStudyCard({ title, description, selected, onToggle }: CaseStudyCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative w-full rounded-lg border p-4 text-left transition-all duration-200",
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-muted-foreground/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
            selected
              ? "border-primary bg-primary"
              : "border-muted-foreground/30"
          )}
        >
          {selected && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
}
