import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProposalStore } from "@/lib/proposalStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, FolderOpen, User, FileText } from "lucide-react";

interface SavedProposal {
  id: string;
  client_name: string | null;
  updated_at: string;
}

export function ProposalSelector() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [proposals, setProposals] = useState<SavedProposal[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    proposalId,
    clientName,
    setProposalId,
    setClientName,
    setClientContext,
    setSelectedCaseStudies,
    setProposalLength,
    setDeliverables,
    reset,
  } = useProposalStore();

  useEffect(() => {
    if (user) {
      fetchProposals();
    }
  }, [user]);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from("proposals")
        .select("id, client_name, updated_at")
        .order("updated_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProposal = async (proposal: SavedProposal) => {
    if (proposal.id === proposalId) return;

    try {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", proposal.id)
        .single();

      if (error) throw error;

      // Load proposal into store
      setProposalId(data.id);
      setClientName(data.client_name || "");
      setClientContext(data.project_context || "");
      setSelectedCaseStudies(data.case_studies || []);
      setProposalLength(data.proposal_length || "medium");
      setDeliverables({
        proposal: data.proposal || "",
        deckPrompt: data.deck_prompt || "",
        contract: data.contract || "",
        proposalEmail: data.proposal_email || "",
        contractEmail: data.contract_email || "",
        invoiceDescription: data.invoice_description || "",
      });

      toast({
        title: "Proposal switched",
        description: `Now viewing: ${data.client_name || "Untitled"}`,
      });

      // If you're not already on /preview, jump there so you see the updated content.
      if (location.pathname !== "/preview") {
        navigate("/preview");
      }
    } catch (error) {
      console.error("Error loading proposal:", error);
    }
  };

  const handleNewProposal = () => {
    reset();
    navigate("/generate");
  };

  const handleViewAllProposals = () => {
    navigate("/proposals");
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  const displayName = clientName || "Untitled Proposal";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-10 px-6 gap-4 bg-white hover:bg-slate-50 border-border shadow-sm w-full max-w-xl justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-primary/15 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Current Proposal:</span>
            <span className="font-semibold text-sm truncate max-w-[250px] text-foreground">{displayName}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[360px] bg-card border-border">
          <DropdownMenuItem onClick={handleNewProposal} className="gap-3 py-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">New Proposal</div>
              <div className="text-xs text-muted-foreground">Start fresh with a new client</div>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {loading ? (
            <DropdownMenuItem disabled className="text-muted-foreground text-sm py-3">
              Loading proposals...
            </DropdownMenuItem>
          ) : proposals.length > 0 ? (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Recent Proposals
              </div>
              {proposals.slice(0, 5).map((proposal) => (
                <DropdownMenuItem
                  key={proposal.id}
                  onClick={() => handleSelectProposal(proposal)}
                  className={`gap-3 py-2.5 ${proposal.id === proposalId ? 'bg-primary/5' : ''}`}
                >
                  <div className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {proposal.client_name || "Untitled"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(proposal.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  {proposal.id === proposalId && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            <DropdownMenuItem disabled className="text-muted-foreground text-sm py-3">
              No saved proposals yet
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleViewAllProposals} className="gap-3 py-2.5 cursor-pointer">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <span>View All Proposals</span>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
