import { useState } from "react";
import { ChevronDown, Lock, Smartphone, TrendingUp, Building2, Palette, Handshake, Presentation, FileText, Play, Target, Users, Briefcase, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  TrendingUp,
  Building2,
  Palette,
  Handshake,
  Presentation,
  FileText,
  Target,
  Users,
  Briefcase,
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

interface ModuleProgress {
  viewed: number;
  total: number;
  percentage: number;
}

interface ModuleCardProps {
  module: Module;
  isLocked?: boolean;
  onProposalClick: (proposal: LibraryProposal) => void;
  onUpgradeClick?: () => void;
  defaultExpanded?: boolean;
  progress?: ModuleProgress;
  viewedProposalIds?: Set<string>;
}

export function ModuleCard({ 
  module, 
  isLocked = false, 
  onProposalClick, 
  onUpgradeClick,
  defaultExpanded = false,
  progress,
  viewedProposalIds = new Set(),
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
    <Card className="overflow-hidden border-border bg-card">
      {/* Module Header */}
      <button
        onClick={handleToggle}
        className="w-full p-5 flex items-center gap-4 hover:bg-accent/30 transition-colors text-left"
      >
        <div className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
          isLocked ? "bg-muted" : "bg-primary/10"
        )}>
          {isLocked ? (
            <Lock className="h-5 w-5 text-muted-foreground" />
          ) : (
            <IconComponent className="h-5 w-5 text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{module.title}</h3>
          {module.subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-1">{module.subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-sm font-semibold text-foreground">
              {progress ? `${progress.viewed}/${progress.total}` : `0/${proposalCount}`}
            </div>
            <div className="text-xs text-muted-foreground">proposals</div>
          </div>
          <ChevronDown className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )} />
        </div>
      </button>

      {/* Expanded Content - Proposal List */}
      {isExpanded && !isLocked && (
        <div className="border-t border-border">
          {module.proposals.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Proposals coming soon</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {module.proposals.map((proposal, index) => {
                const isViewed = viewedProposalIds.has(proposal.id);
                const dealSize = formatDealSize(proposal.deal_size_min, proposal.deal_size_max);
                
                return (
                  <button
                    key={proposal.id}
                    onClick={() => onProposalClick(proposal)}
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-accent/30 transition-colors text-left group"
                  >
                    {/* Play/Lock icon */}
                    <div className="shrink-0">
                      {isViewed ? (
                        <Play className="h-4 w-4 text-primary fill-primary" />
                      ) : (
                        <Play className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium text-foreground group-hover:text-primary transition-colors",
                        isViewed && "text-muted-foreground"
                      )}>
                        {proposal.title}
                      </p>
                    </div>

                    {/* Deal size + View button */}
                    <div className="flex items-center gap-4 shrink-0">
                      {dealSize && (
                        <span className="text-sm text-muted-foreground hidden sm:block">
                          {dealSize}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        <Play className="h-4 w-4" />
                        <span>View</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Locked State */}
      {isExpanded && isLocked && (
        <div className="border-t border-border p-6 bg-muted/30">
          <div className="text-center">
            <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upgrade to access this module
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
