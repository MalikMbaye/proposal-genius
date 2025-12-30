import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const businessTypes = [
  {
    value: "marketing",
    label: "Marketing Consultant",
    description: "Growth, demand gen, content, paid ads",
  },
  {
    value: "strategy",
    label: "Strategy Consultant",
    description: "Business strategy, operations, planning",
  },
  {
    value: "tech",
    label: "Tech Consultant",
    description: "Software, AI, automation, data",
  },
  {
    value: "creative",
    label: "Creative Agency",
    description: "Design, branding, video, content",
  },
  {
    value: "other",
    label: "Other",
    description: "Specify your consulting type",
  },
];

interface BusinessTypeSelectorProps {
  value: string;
  customValue: string;
  onChange: (value: string) => void;
  onCustomChange: (value: string) => void;
}

export function BusinessTypeSelector({
  value,
  customValue,
  onChange,
  onCustomChange,
}: BusinessTypeSelectorProps) {
  const isOther = value === "other";

  return (
    <div className="space-y-4">
      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        {businessTypes.map((type) => (
          <label
            key={type.value}
            className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all ${
              value === type.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <RadioGroupItem value={type.value} />
            <div className="flex-1">
              <div className="font-medium">{type.label}</div>
              <div className="text-sm text-muted-foreground">
                {type.description}
              </div>
            </div>
          </label>
        ))}
      </RadioGroup>

      {isOther && (
        <div className="mt-4">
          <Label htmlFor="customType" className="text-sm mb-2 block">
            Describe your consulting type
          </Label>
          <Input
            id="customType"
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="e.g., HR Consultant, Financial Advisor..."
            className="bg-background"
          />
        </div>
      )}
    </div>
  );
}

export { businessTypes };
