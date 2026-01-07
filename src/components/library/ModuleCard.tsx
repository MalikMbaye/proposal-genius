import { useState } from "react";
import { ChevronDown, Lock, Smartphone, TrendingUp, Building2, Palette, Handshake, Presentation, FileText, Play, Target, Users, Briefcase } from "lucide-react";
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
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Module Header */}
      <button
        onClick={handleToggle}
        className="w-full p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
          isLocked ? "bg-slate-100" : "bg-slate-100"
        )}>
          {isLocked ? (
            <Lock className="h-5 w-5 text-slate-400" />
          ) : (
            <IconComponent className="h-5 w-5 text-slate-700" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900">{module.title}</h3>
          {module.subtitle && (
            <p className="text-sm text-slate-500 line-clamp-1">{module.subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900">
              {progress ? `${progress.viewed}/${progress.total}` : `0/${proposalCount}`}
            </div>
            <div className="text-xs text-slate-500">proposals</div>
          </div>
          <ChevronDown className={cn(
            "h-5 w-5 text-slate-400 transition-transform duration-200",
            isExpanded && "rotate-180"
          )} />
        </div>
      </button>

      {/* Expanded Content - Proposal List */}
      {isExpanded && !isLocked && (
        <div className="border-t border-slate-100">
          {module.proposals.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Proposals coming soon</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {module.proposals.map((proposal) => {
                const isViewed = viewedProposalIds.has(proposal.id);
                const dealSize = formatDealSize(proposal.deal_size_min, proposal.deal_size_max);
                
                return (
                  <button
                    key={proposal.id}
                    onClick={() => onProposalClick(proposal)}
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left group"
                  >
                    {/* Play icon */}
                    <div className="shrink-0">
                      <Play className={cn(
                        "h-4 w-4",
                        isViewed ? "text-emerald-600 fill-emerald-600" : "text-slate-400"
                      )} />
                    </div>
                    
                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium group-hover:text-emerald-700 transition-colors",
                        isViewed ? "text-slate-500" : "text-slate-900"
                      )}>
                        {proposal.title}
                      </p>
                    </div>

                    {/* Deal size + View button */}
                    <div className="flex items-center gap-4 shrink-0">
                      {dealSize && (
                        <span className="text-sm text-slate-500 hidden sm:block">
                          {dealSize}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">
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
      {isLocked && (
        <div className="border-t border-slate-100 p-6 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-500">
                {proposalCount} proposals locked
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
