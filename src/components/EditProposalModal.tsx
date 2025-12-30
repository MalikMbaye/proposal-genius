import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PricingTierInput } from "@/components/PricingTierInput";
import { useProposalStore, proposalLengths, PricingTier } from "@/lib/proposalStore";
import { Loader2, RefreshCw } from "lucide-react";

interface EditProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export function EditProposalModal({
  open,
  onOpenChange,
  onRegenerate,
  isRegenerating = false,
}: EditProposalModalProps) {
  const {
    clientName,
    setClientName,
    clientContext,
    setClientContext,
    proposalLength,
    setProposalLength,
    pricingTiers,
    setPricingTiers,
  } = useProposalStore();

  // Local state for editing
  const [localClientName, setLocalClientName] = useState(clientName);
  const [localClientContext, setLocalClientContext] = useState(clientContext);
  const [localProposalLength, setLocalProposalLength] = useState(proposalLength);
  const [localPricingTiers, setLocalPricingTiers] = useState<PricingTier[]>(pricingTiers);

  // Sync local state when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLocalClientName(clientName);
      setLocalClientContext(clientContext);
      setLocalProposalLength(proposalLength);
      setLocalPricingTiers(pricingTiers);
    }
    onOpenChange(newOpen);
  };

  const handleRegenerate = () => {
    // Save changes to store
    setClientName(localClientName);
    setClientContext(localClientContext);
    setProposalLength(localProposalLength);
    setPricingTiers(localPricingTiers);
    
    // Trigger regeneration
    onRegenerate();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-100">Edit Proposal Inputs</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client Name */}
          <div>
            <Label htmlFor="editClientName" className="text-sm font-medium text-slate-300 mb-2 block">
              Client Name
            </Label>
            <Input
              id="editClientName"
              value={localClientName}
              onChange={(e) => setLocalClientName(e.target.value)}
              placeholder="e.g., Sarah from BrightTools"
              className="bg-slate-900 border-slate-600 text-slate-100"
            />
          </div>

          {/* Client Context */}
          <div>
            <Label className="text-sm font-medium text-slate-300 mb-2 block">
              Project Context
            </Label>
            <Textarea
              value={localClientContext}
              onChange={(e) => setLocalClientContext(e.target.value)}
              placeholder="Describe the client's problem, goals, and budget..."
              className="min-h-[150px] resize-none bg-slate-900 border-slate-600 text-slate-100"
            />
          </div>

          {/* Pricing Tiers */}
          <div>
            <Label className="text-sm font-medium text-slate-300 mb-2 block">
              Pricing Tiers
            </Label>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
              <PricingTierInput
                tiers={localPricingTiers}
                onChange={setLocalPricingTiers}
                maxTiers={3}
              />
            </div>
          </div>

          {/* Proposal Length */}
          <div>
            <Label className="text-sm font-medium text-slate-300 mb-2 block">
              Proposal Length
            </Label>
            <RadioGroup
              value={localProposalLength}
              onValueChange={setLocalProposalLength}
              className="space-y-2"
            >
              {proposalLengths.map((length) => (
                <label
                  key={length.value}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                    localProposalLength === length.value
                      ? "border-primary bg-primary/10"
                      : "border-slate-600 hover:border-slate-500 bg-slate-900"
                  }`}
                >
                  <RadioGroupItem value={length.value} />
                  <div className="flex-1">
                    <div className="font-medium text-slate-100">{length.label}</div>
                    <div className="text-sm text-slate-400">
                      {length.description}
                    </div>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRegenerating}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRegenerate}
            disabled={isRegenerating || localClientContext.trim().length < 20}
          >
            {isRegenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Proposal
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
