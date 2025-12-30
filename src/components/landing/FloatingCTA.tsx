import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <Button
        size="lg"
        className="rounded-full shadow-2xl shadow-primary/30 px-6 gap-2 hover:scale-105 transition-transform"
        asChild
      >
        <Link to="/generate">
          Create Your First Proposal
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
