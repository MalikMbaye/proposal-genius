import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <div className="flex justify-center pointer-events-auto">
        <Button
          size="lg"
          className="rounded-full shadow-2xl shadow-primary/40 px-8 py-6 text-lg gap-3 hover:scale-105 transition-transform"
          asChild
        >
          <Link to="/generate">
            Create Your First Proposal
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
