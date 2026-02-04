import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Crown, Sparkles, Zap, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalsUsed?: number;
  proposalsLimit?: number;
}

export function PaywallModal({ 
  open, 
  onOpenChange,
  proposalsUsed = 0,
  proposalsLimit = 3,
}: PaywallModalProps) {
  const { user } = useAuth();
  const { openCheckout, subscribed, has_lifetime } = useSubscription();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (productType: 'pro_monthly' | 'lifetime' | 'extra_proposals') => {
    if (!user) {
      onOpenChange(false);
      navigate('/auth');
      return;
    }

    setIsLoading(productType);
    try {
      await openCheckout(productType);
      onOpenChange(false);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to open checkout. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  // If user already has subscription, show extra proposals option
  const showExtraProposals = subscribed && !has_lifetime;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-fit">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">
            {showExtraProposals ? "Need More Proposals?" : "You've Hit Your Limit"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {showExtraProposals 
              ? `You've used ${proposalsUsed} of your ${proposalsLimit} monthly proposals.`
              : `You've used all ${proposalsLimit} free proposals. Upgrade to continue generating winning proposals.`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {!subscribed && !has_lifetime && (
            <>
              {/* Pro Monthly */}
              <div className="rounded-xl border-2 border-primary bg-primary/5 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Pro Access
                    </h3>
                    <p className="text-sm text-muted-foreground">Unlock unlimited potential</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">$10</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Unlimited proposals per month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    All 6 deliverables included
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Priority support
                  </li>
                </ul>
                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={() => handleUpgrade('pro_monthly')}
                  disabled={isLoading !== null}
                >
                  {isLoading === 'pro_monthly' ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Upgrade to Pro
                </Button>
              </div>
            </>
          )}

          {/* Extra Proposals - for existing subscribers */}
          {showExtraProposals && (
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Extra Proposals Pack
                  </h3>
                  <p className="text-sm text-muted-foreground">Add more this month</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">$20</span>
                  <span className="text-muted-foreground"> one-time</span>
                </div>
              </div>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  20 additional proposals
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  Never expires
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  Buy as many as you need
                </li>
              </ul>
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => handleUpgrade('extra_proposals')}
                disabled={isLoading !== null}
              >
                {isLoading === 'extra_proposals' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Get 20 More Proposals
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Secure payment via Stripe • 30-day money-back guarantee
        </p>
      </DialogContent>
    </Dialog>
  );
}