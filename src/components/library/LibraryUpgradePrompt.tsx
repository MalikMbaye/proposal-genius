import { Zap, Clock, Play, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  const features = [
    { icon: Clock, label: "$1.5M+ in deals" },
    { icon: Play, label: "50+ proposals" },
    { icon: FileText, label: "50+ templates" },
    { icon: CheckCircle, label: "Lifetime access" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="outline" className="mb-4 gap-1.5 px-3 py-1 text-sm font-medium border-border bg-background">
          <FileText className="h-3.5 w-3.5" />
          Library
        </Badge>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          The Proposal Library
        </h1>
        <p className="text-muted-foreground text-lg">
          50+ real proposals from $1.5M+ in closed deals
        </p>
      </div>

      {/* Preview Modules (locked state) */}
      <div className="space-y-4 mb-8">
        {[
          { title: "App Development & Product Builds", subtitle: "Full-stack proposals for mobile apps, web apps, and digital products", count: 6 },
          { title: "Growth Marketing & Customer Acquisition", subtitle: "Proposals for scaling revenue, content systems, and paid media", count: 5 },
          { title: "B2B SaaS & Enterprise", subtitle: "Complex proposals for software companies and enterprise clients", count: 4 },
          { title: "Brand Development & Launch Strategy", subtitle: "Branding, positioning, pre-launch, and market validation", count: 4 },
        ].map((module, i) => (
          <Card key={i} className="p-5 border-border bg-card opacity-60">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{module.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{module.subtitle}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-foreground">0/{module.count}</div>
                <div className="text-xs text-muted-foreground">proposals</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Upgrade CTA Card */}
      <Card className="p-8 border-border bg-muted/30 text-center">
        <div className="flex justify-center mb-4">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Unlock the Full Library
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Get lifetime access to all 50+ proposals, templates, and expert annotations.
        </p>

        {/* Price */}
        <div className="flex items-baseline justify-center gap-2 mb-6">
          <span className="text-4xl font-bold text-foreground">$497</span>
          <span className="text-xl text-muted-foreground line-through">$997</span>
          <Badge variant="secondary" className="ml-2">50% Off</Badge>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button size="lg" onClick={handleUpgrade} className="text-base px-8 gap-2">
          <Zap className="h-4 w-4" />
          Get Instant Access — $497
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Secure checkout powered by Stripe. 30-day money-back guarantee.
        </p>
      </Card>
    </div>
  );
}
