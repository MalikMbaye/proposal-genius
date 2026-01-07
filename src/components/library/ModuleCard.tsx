import { useState } from "react";
import { ChevronDown, ChevronRight, Lock, Smartphone, TrendingUp, Building2, Palette, Handshake, Presentation, FileText, DollarSign, Eye, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  TrendingUp,
  Building2,
  Palette,
  Handshake,
  Presentation,
  FileText,
};

export interface LibraryProposal {
  id: string;
  title: string;
  description: string | null;
  deal_size_min: number | null;
  deal_size_max: number | null;
  industry: string;
  deliverable_type: string | null;
  outcome: string | null;
  pdf_path: string;
  page_count: number | null;
}

export interface Module {
  id: string;
  title: string;
  subtitle: string | null;
  icon: string;
  sort_order: number;
  proposals: LibraryProposal[];
}

interface ModuleCardProps {
  module: Module;
  isLocked?: boolean;
  onProposalClick: (proposal: LibraryProposal) => void;
  onUpgradeClick?: () => void;
  defaultExpanded?: boolean;
}

const INDUSTRY_LABELS: Record<string, string> = {
  ecommerce: "E-commerce",
  saas: "SaaS",
  fintech: "Fintech",
  fitness: "Fitness",
  wellness: "Wellness",
  career: "Career",
  media: "Media",
  food_beverage: "Food & Beverage",
  sports: "Sports",
  consumer_apps: "Consumer Apps",
  real_estate: "Real Estate",
  technology: "Technology",
  finance: "Finance",
  healthcare: "Healthcare",
  education: "Education",
  nonprofit: "Nonprofit",
  retail: "Retail",
  consulting: "Consulting",
  other: "Other",
};

export function ModuleCard({ 
  module, 
  isLocked = false, 
  onProposalClick, 
  onUpgradeClick,
  defaultExpanded = false 
}: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const IconComponent = ICON_MAP[module.icon] || FileText;
  const proposalCount = module.proposals.length;

  const formatDealSize = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    const format = (n: number) => {
      if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
      if (n >= 1000) return `$${Math.round(n / 1000)}K`;
      return `$${n}`;
    };
    if (min && max && min !== max) return `${format(min)} - ${format(max)}`;
    if (min) return format(min);
    if (max) return format(max);
    return null;
  };

  const handleToggle = () => {
    if (isLocked && onUpgradeClick) {
      onUpgradeClick();
      return;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200",
      isLocked && "opacity-70"
    )}>
      {/* Module Header */}
      <button
        onClick={handleToggle}
        className="w-full p-5 flex items-center gap-4 hover:bg-accent/50 transition-colors text-left"
      >
        <div className={cn(
          "p-3 rounded-lg",
          isLocked ? "bg-muted" : "bg-primary/10"
        )}>
          {isLocked ? (
            <Lock className="h-6 w-6 text-muted-foreground" />
          ) : (
            <IconComponent className="h-6 w-6 text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg">{module.title}</h3>
          {module.subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-1">{module.subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {proposalCount} proposals
          </span>
          {isLocked ? (
            <Lock className="h-5 w-5 text-muted-foreground" />
          ) : isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && !isLocked && (
        <div className="border-t border-border">
          {module.proposals.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Proposals coming soon</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {module.proposals.map((proposal) => (
                <button
                  key={proposal.id}
                  onClick={() => onProposalClick(proposal)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-accent/30 transition-colors text-left group"
                >
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {proposal.title}
                    </p>
                    {proposal.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {proposal.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {formatDealSize(proposal.deal_size_min, proposal.deal_size_max) && (
                      <Badge variant="secondary" className="text-xs font-semibold">
                        <DollarSign className="h-3 w-3 mr-0.5" />
                        {formatDealSize(proposal.deal_size_min, proposal.deal_size_max)}
                      </Badge>
                    )}
                    {proposal.industry && (
                      <Badge variant="outline" className="text-xs hidden md:flex">
                        {INDUSTRY_LABELS[proposal.industry] || proposal.industry}
                      </Badge>
                    )}
                    {proposal.outcome === "closed_won" && (
                      <CheckCircle className="h-4 w-4 text-green-500 hidden sm:block" />
                    )}
                    <Button variant="ghost" size="sm" className="h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Locked Overlay */}
      {isLocked && (
        <div className="border-t border-border p-6 bg-muted/50">
          <div className="text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">
              Unlock full access to view this module
            </p>
            <Button onClick={onUpgradeClick} size="sm">
              Upgrade to Access
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
