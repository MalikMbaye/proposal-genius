import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Clock, ArrowRight } from "lucide-react";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const navigate = useNavigate();

  const handleExitIntent = useCallback((e: MouseEvent) => {
    // Only trigger when mouse leaves toward top of viewport (browser chrome)
    if (e.clientY <= 5 && !hasShown) {
      // Check if user has already seen this popup in this session
      const alreadySeen = sessionStorage.getItem("exitIntentShown");
      if (alreadySeen) return;

      setIsOpen(true);
      setHasShown(true);
      sessionStorage.setItem("exitIntentShown", "true");
    }
  }, [hasShown]);

  useEffect(() => {
    // Only add listener after a delay (user has been on page for a bit)
    const timer = setTimeout(() => {
      document.addEventListener("mouseout", handleExitIntent);
    }, 15000); // Wait 15 seconds before enabling exit intent

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", handleExitIntent);
    };
  }, [handleExitIntent]);

  const handleStartFree = () => {
    setIsOpen(false);
    navigate("/generate");
  };

  const handleViewPricing = () => {
    setIsOpen(false);
    // Scroll to pricing section
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/20 rounded-full w-fit">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Wait! Before you go...
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-2">
            You can try PitchGenius completely free. Generate 2 professional proposals and see the quality for yourself.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Value props */}
          <div className="grid gap-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Generate 2 complete proposal packages</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>All 6 deliverables included free</span>
            </div>
          </div>

          {/* Urgency indicator */}
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">
              Launch pricing ends soon
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleStartFree}
              size="lg"
              className="w-full group"
            >
              Try It Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              onClick={handleViewPricing}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust line */}
          <p className="text-xs text-muted-foreground text-center">
            Join 500+ consultants already using PitchGenius
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
