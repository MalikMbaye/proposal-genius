import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { LibraryHeader } from "./LibraryHeader";
import { LibraryFilters } from "./LibraryFilters";
import { ModuleCard, Module, LibraryProposal } from "./ModuleCard";
import { SecureProposalViewer } from "./SecureProposalViewer";

interface LibraryModuleViewProps {
  onUpgradeClick?: () => void;
}

export function LibraryModuleView({ onUpgradeClick }: LibraryModuleViewProps) {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<LibraryProposal | null>(null);
  const [viewedProposalIds, setViewedProposalIds] = useState<Set<string>>(new Set());

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dealSizeFilter, setDealSizeFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch user's viewed proposals
  const fetchViewedProposals = useCallback(async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("user_proposal_views")
      .select("library_item_id")
      .eq("user_id", user.id);
    
    if (data) {
      setViewedProposalIds(new Set(data.map(v => v.library_item_id)));
    }
  }, [user]);

  useEffect(() => {
    fetchModulesAndProposals();
    fetchViewedProposals();
  }, [fetchViewedProposals]);

  const fetchModulesAndProposals = async () => {
    try {
      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from("library_modules")
        .select("*")
        .order("sort_order", { ascending: true });

      if (modulesError) throw modulesError;

      // Fetch proposals
      const { data: proposalsData, error: proposalsError } = await supabase
        .from("library_items")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (proposalsError) throw proposalsError;

      // Map proposals to modules
      const modulesWithProposals: Module[] = (modulesData || []).map((mod) => ({
        ...mod,
        proposals: (proposalsData || []).filter((p) => p.module_id === mod.id) as LibraryProposal[],
      }));

      // Add an "Uncategorized" module for proposals without a module
      const uncategorizedProposals = (proposalsData || []).filter((p) => !p.module_id);
      if (uncategorizedProposals.length > 0) {
        modulesWithProposals.push({
          id: "uncategorized",
          title: "More Proposals",
          subtitle: "Additional proposals from our library",
          icon: "FileText",
          sort_order: 999,
          proposals: uncategorizedProposals as LibraryProposal[],
        });
      }

      setModules(modulesWithProposals);
    } catch (error) {
      console.error("Error fetching library data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Record a view when proposal is opened
  const recordView = useCallback(async (proposalId: string) => {
    if (!user) return;
    
    try {
      // Upsert the view record
      const { error } = await supabase
        .from("user_proposal_views")
        .upsert({
          user_id: user.id,
          library_item_id: proposalId,
          last_viewed_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,library_item_id",
        });
      
      if (!error) {
        setViewedProposalIds(prev => new Set([...prev, proposalId]));
      }
    } catch (err) {
      console.error("Error recording view:", err);
    }
  }, [user]);

  // Apply filters to proposals within modules
  const filteredModules = useMemo(() => {
    return modules.map((mod) => {
      const filtered = mod.proposals.filter((proposal) => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = proposal.title.toLowerCase().includes(query);
          const matchesDesc = proposal.description?.toLowerCase().includes(query);
          if (!matchesTitle && !matchesDesc) return false;
        }

        // Deal size filter
        if (dealSizeFilter !== "all") {
          const min = proposal.deal_size_min || 0;
          const max = proposal.deal_size_max || min;
          const dealSize = max || min;
          
          switch (dealSizeFilter) {
            case "under5k":
              if (dealSize >= 5000) return false;
              break;
            case "5k-25k":
              if (dealSize < 5000 || dealSize > 25000) return false;
              break;
            case "25k-100k":
              if (dealSize < 25000 || dealSize > 100000) return false;
              break;
            case "over100k":
              if (dealSize < 100000) return false;
              break;
          }
        }

        // Industry filter
        if (industryFilter !== "all" && proposal.industry !== industryFilter) {
          return false;
        }

        // Type filter
        if (typeFilter !== "all" && proposal.deliverable_type !== typeFilter) {
          return false;
        }

        return true;
      });

      return { ...mod, proposals: filtered };
    }).filter((mod) => mod.proposals.length > 0 || searchQuery === "");
  }, [modules, searchQuery, dealSizeFilter, industryFilter, typeFilter]);

  const handleProposalClick = (proposal: LibraryProposal) => {
    setSelectedProposal(proposal);
    recordView(proposal.id);
  };

  // Calculate progress for each module
  const getModuleProgress = (module: Module) => {
    if (module.proposals.length === 0) return { viewed: 0, total: 0, percentage: 0 };
    const viewed = module.proposals.filter(p => viewedProposalIds.has(p.id)).length;
    return {
      viewed,
      total: module.proposals.length,
      percentage: Math.round((viewed / module.proposals.length) * 100),
    };
  };

  // Calculate total progress
  const totalStats = useMemo(() => {
    const allProposals = modules.flatMap(m => m.proposals);
    const total = allProposals.length;
    const viewed = allProposals.filter(p => viewedProposalIds.has(p.id)).length;
    return { total, viewed };
  }, [modules, viewedProposalIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (selectedProposal) {
    return (
      <SecureProposalViewer
        item={{
          id: selectedProposal.id,
          title: selectedProposal.title,
          description: selectedProposal.description,
          pdf_path: selectedProposal.pdf_path,
          page_count: selectedProposal.page_count || 1,
        }}
        onClose={() => setSelectedProposal(null)}
      />
    );
  }

  return (
    <div>
      <LibraryHeader 
        totalProposals={totalStats.total} 
        viewedCount={totalStats.viewed} 
      />
      
      <LibraryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dealSizeFilter={dealSizeFilter}
        onDealSizeChange={setDealSizeFilter}
        industryFilter={industryFilter}
        onIndustryChange={setIndustryFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />

      {/* Section Title */}
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Proposal Modules</h2>

      <div className="space-y-4">
        {filteredModules.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-slate-200 bg-white">
            <p className="text-slate-500">No proposals match your filters</p>
          </div>
        ) : (
          filteredModules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              isLocked={false}
              onProposalClick={handleProposalClick}
              onUpgradeClick={onUpgradeClick}
              progress={getModuleProgress(module)}
              viewedProposalIds={viewedProposalIds}
              defaultExpanded={index === 0}
            />
          ))
        )}
      </div>
    </div>
  );
}
