import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export interface PricingTier {
  id: string;
  name: string;
  price: string;
}

interface PricingTierInputProps {
  tiers: PricingTier[];
  onChange: (tiers: PricingTier[]) => void;
  maxTiers?: number;
}

export function PricingTierInput({ tiers, onChange, maxTiers = 3 }: PricingTierInputProps) {
  const addTier = () => {
    if (tiers.length >= maxTiers) return;
    const newTier: PricingTier = {
      id: `tier-${Date.now()}`,
      name: "",
      price: "",
    };
    onChange([...tiers, newTier]);
  };

  const removeTier = (id: string) => {
    if (tiers.length <= 1) return;
    onChange(tiers.filter((t) => t.id !== id));
  };

  const updateTier = (id: string, field: "name" | "price", value: string) => {
    onChange(
      tiers.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  return (
    <div className="space-y-4">
      {tiers.map((tier, index) => (
        <div
          key={tier.id}
          className="p-4 rounded-lg border border-border bg-background/50 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Tier {index + 1}
            </span>
            {tiers.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTier(tier.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid gap-3">
            <div>
              <Label htmlFor={`name-${tier.id}`} className="text-sm mb-1.5 block">
                Service Name
              </Label>
              <Input
                id={`name-${tier.id}`}
                value={tier.name}
                onChange={(e) => updateTier(tier.id, "name", e.target.value)}
                placeholder="e.g., Strategy & Training"
                className="bg-background"
              />
            </div>
            <div>
              <Label htmlFor={`price-${tier.id}`} className="text-sm mb-1.5 block">
                Price Range
              </Label>
              <Input
                id={`price-${tier.id}`}
                value={tier.price}
                onChange={(e) => updateTier(tier.id, "price", e.target.value)}
                placeholder="e.g., $7K-10K"
                className="bg-background"
              />
            </div>
          </div>
        </div>
      ))}

      {tiers.length < maxTiers && (
        <Button
          type="button"
          variant="outline"
          onClick={addTier}
          className="w-full border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Pricing Tier
        </Button>
      )}

      <p className="text-sm text-muted-foreground">
        Add up to {maxTiers} pricing tiers for your proposal
      </p>
    </div>
  );
}
