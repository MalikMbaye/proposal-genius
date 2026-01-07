import { Lock, BookOpen, Video, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LibraryUpgradePrompt() {
  const handleUpgrade = () => {
    // Scroll to pricing or navigate
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#pricing";
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Lock className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Proposal Library</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Access our exclusive collection of real, winning proposals with expert annotations. 
          Learn the exact strategies that close 6-figure deals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <FileText className="h-8 w-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Real Proposals</h3>
          <p className="text-muted-foreground">
            Browse redacted proposals from actual closed deals across multiple industries and deal sizes.
          </p>
        </Card>
        <Card className="p-6">
          <BookOpen className="h-8 w-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Expert Annotations</h3>
          <p className="text-muted-foreground">
            Page-by-page breakdowns explaining why each section works — like game film for proposals.
          </p>
        </Card>
        <Card className="p-6">
          <Video className="h-8 w-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Full Course Access</h3>
          <p className="text-muted-foreground">
            3+ hours of video training on proposal strategy, pricing psychology, and closing techniques.
          </p>
        </Card>
        <Card className="p-6">
          <Shield className="h-8 w-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Continuous Updates</h3>
          <p className="text-muted-foreground">
            New proposals and content added regularly. Your library grows over time.
          </p>
        </Card>
      </div>

      <div className="text-center">
        <Button size="lg" onClick={handleUpgrade} className="text-lg px-8 py-6">
          Unlock Library Access — $500
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          One-time payment. Lifetime access.
        </p>
      </div>
    </div>
  );
}
