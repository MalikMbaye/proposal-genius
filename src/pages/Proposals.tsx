import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useProposalStore } from "@/lib/proposalStore";
import {
  FileText,
  Plus,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavedProposal {
  id: string;
  client_name: string | null;
  project_context: string | null;
  budget_min: number | null;
  budget_max: number | null;
  created_at: string;
  updated_at: string;
  proposal: string | null;
  deck_prompt: string | null;
  contract: string | null;
  proposal_email: string | null;
  contract_email: string | null;
  invoice_description: string | null;
  case_studies: string[] | null;
  proposal_length: string | null;
}

export default function Proposals() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proposals, setProposals] = useState<SavedProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const {
    setClientContext,
    setBackground,
    setSelectedCaseStudies,
    setPricingStrategy,
    setPricingAI,
    setPricingManaged,
    setDeliverables,
    setProposalId,
    setProposalLength,
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
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast({
        title: "Error loading proposals",
        description: "Failed to load your saved proposals.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("proposals")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setProposals((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: "Proposal deleted",
        description: "The proposal has been removed.",
      });
    } catch (error) {
      console.error("Error deleting proposal:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the proposal.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (proposal: SavedProposal) => {
    // Load proposal data into store
    setProposalId(proposal.id);
    setClientContext(proposal.client_name || "");
    setBackground(proposal.project_context || "");
    setSelectedCaseStudies(proposal.case_studies || []);
    setProposalLength(proposal.proposal_length || "standard");
    
    // Set pricing (format as strings for the store)
    setPricingStrategy("fixed");
    if (proposal.budget_min) setPricingAI(`$${proposal.budget_min.toLocaleString()}`);
    if (proposal.budget_max) setPricingManaged(`$${proposal.budget_max.toLocaleString()}`);
    
    // Set deliverables
    setDeliverables({
      proposal: proposal.proposal || "",
      deckPrompt: proposal.deck_prompt || "",
      contract: proposal.contract || "",
      proposalEmail: proposal.proposal_email || "",
      contractEmail: proposal.contract_email || "",
      invoiceDescription: proposal.invoice_description || "",
    });

    navigate("/preview");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return null;
  };

  const getAssetCount = (proposal: SavedProposal) => {
    let count = 0;
    if (proposal.proposal) count++;
    if (proposal.deck_prompt) count++;
    if (proposal.contract) count++;
    if (proposal.proposal_email) count++;
    if (proposal.contract_email) count++;
    if (proposal.invoice_description) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <Button asChild>
            <Link to="/generate">
              <Plus className="mr-2 h-4 w-4" />
              New Proposal
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Saved Proposals</h1>
            <p className="text-muted-foreground">
              View and manage your previously generated proposals.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : proposals.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FolderOpen className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No proposals yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get started by creating your first proposal. It only takes a few minutes.
              </p>
              <Button asChild size="lg">
                <Link to="/generate">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Proposal
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">
                            {proposal.client_name || "Untitled Proposal"}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(proposal.updated_at)}
                            </span>
                            {formatBudget(proposal.budget_min, proposal.budget_max) && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5" />
                                {formatBudget(proposal.budget_min, proposal.budget_max)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {proposal.project_context && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-3 pl-[52px]">
                          {proposal.project_context}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3 pl-[52px]">
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                          {getAssetCount(proposal)} asset{getAssetCount(proposal) !== 1 ? "s" : ""} generated
                        </span>
                        {proposal.proposal_length && (
                          <span className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-muted-foreground capitalize">
                            {proposal.proposal_length}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(proposal)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={deletingId === proposal.id}
                          >
                            {deletingId === proposal.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Proposal</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{proposal.client_name || "Untitled Proposal"}"? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(proposal.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}