import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ScreenshotDropZone, type AnalysisResult } from '@/components/leads/ScreenshotDropZone';
import { LeadCard, type Lead } from '@/components/leads/LeadCard';
import { LeadThread } from '@/components/leads/LeadThread';
import { DMUsageMeter } from '@/components/leads/DMUsageMeter';
import { AppLayout } from '@/components/AppLayout';
import { useProposalStore } from '@/lib/proposalStore';
import { Loader2, Users, MessageSquareText, FileText } from 'lucide-react';

interface ProposalLead {
  id: string;
  name: string;
  proposal_count: number;
  last_activity: string;
  budget_range: string | null;
  proposal_id: string;
}

export default function Leads() {
  const navigate = useNavigate();
  const { reset } = useProposalStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [proposalLeads, setProposalLeads] = useState<ProposalLead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllLeads();
  }, []);

  const fetchAllLeads = async () => {
    setLoading(true);
    
    // Fetch DM leads from leads table
    const { data: dmLeads, error: dmError } = await supabase
      .from('leads')
      .select('*')
      .order('last_activity', { ascending: false });
    
    if (!dmError) {
      setLeads((dmLeads || []) as Lead[]);
    }

    // Fetch leads derived from proposals (grouped by client_name)
    const { data: proposals, error: proposalError } = await supabase
      .from('proposals')
      .select('id, client_name, budget_min, budget_max, updated_at')
      .not('client_name', 'is', null)
      .order('updated_at', { ascending: false });

    if (!proposalError && proposals) {
      // Group proposals by client_name
      const clientMap = new Map<string, ProposalLead>();
      
      for (const p of proposals) {
        const clientName = p.client_name || 'Unknown';
        if (!clientMap.has(clientName)) {
          const budgetRange = p.budget_min && p.budget_max 
            ? `$${p.budget_min.toLocaleString()} - $${p.budget_max.toLocaleString()}`
            : p.budget_min 
              ? `$${p.budget_min.toLocaleString()}+`
              : null;
          
          clientMap.set(clientName, {
            id: `proposal-${p.id}`,
            name: clientName,
            proposal_count: 1,
            last_activity: p.updated_at,
            budget_range: budgetRange,
            proposal_id: p.id,
          });
        } else {
          const existing = clientMap.get(clientName)!;
          existing.proposal_count++;
        }
      }
      
      setProposalLeads(Array.from(clientMap.values()));
    }
    
    setLoading(false);
  };

  const handleScreenshotAnalyzed = (result: AnalysisResult) => {
    if (result.isNewLead) {
      fetchAllLeads();
    }
    setSelectedLeadId(result.leadId);
  };

  const handleBackFromThread = () => {
    setSelectedLeadId(null);
    fetchAllLeads();
  };

  const handleNewProposal = () => {
    reset();
    navigate("/generate");
  };

  // Combine and categorize all leads
  const allLeads = [
    ...proposalLeads.map(pl => ({
      id: pl.id,
      name: pl.name,
      status: 'proposal_sent' as const,
      last_activity: pl.last_activity,
      budget_range: pl.budget_range,
      proposal_count: pl.proposal_count,
      isProposalLead: true,
      proposal_id: pl.proposal_id,
    })),
    ...leads.map(l => ({
      ...l,
      isProposalLead: false,
      proposal_count: 0,
    })),
  ];

  // Group leads by status
  const activeLeads = allLeads.filter(l => !['qualified', 'proposal_sent', 'closed', 'lost'].includes(l.status));
  const qualifiedLeads = allLeads.filter(l => l.status === 'qualified' || l.status === 'proposal_sent');
  const closedLeads = allLeads.filter(l => l.status === 'closed' || l.status === 'lost');

  const hasAnyLeads = allLeads.length > 0;

  return (
    <AppLayout onNewProposal={handleNewProposal}>
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {selectedLeadId && !selectedLeadId.startsWith('proposal-') ? (
          <LeadThread 
            leadId={selectedLeadId} 
            onBack={handleBackFromThread}
          />
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-slate-100">
                  <Users className="h-8 w-8 text-primary" />
                  All Leads
                </h1>
                <p className="text-slate-400">
                  Your prospects from proposals and DM conversations
                </p>
              </div>
              <DMUsageMeter className="md:w-72" />
            </div>

            {/* Global Screenshot Drop Zone */}
            <ScreenshotDropZone 
              onAnalyzed={handleScreenshotAnalyzed}
              className="mb-10"
            />

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !hasAnyLeads ? (
              <div className="text-center py-16 px-4">
                <MessageSquareText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">No leads yet</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Generate a proposal or drop a DM screenshot to create your first lead.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Qualified / Proposal Leads */}
                {qualifiedLeads.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-200">
                      <span className="text-xl">✅</span>
                      Proposal Sent / Qualified
                      <span className="text-sm font-normal text-slate-400">({qualifiedLeads.length})</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {qualifiedLeads.map(lead => (
                        <div
                          key={lead.id}
                          onClick={() => {
                            if (lead.isProposalLead && lead.proposal_id) {
                              navigate(`/preview?proposalId=${lead.proposal_id}`);
                            } else {
                              setSelectedLeadId(lead.id);
                            }
                          }}
                          className="p-4 rounded-lg bg-slate-800 border border-slate-600 hover:border-primary/50 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-lg font-bold text-primary">
                                {lead.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-slate-100 truncate group-hover:text-primary transition-colors">
                                {lead.name}
                              </h3>
                              {lead.budget_range && (
                                <p className="text-xs text-slate-400">{lead.budget_range}</p>
                              )}
                            </div>
                          </div>
                          {lead.isProposalLead && (
                            <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2">
                              <FileText className="h-3 w-3" />
                              <span>{lead.proposal_count} proposal{lead.proposal_count > 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Active Leads */}
                {activeLeads.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-200">
                      <span className="text-xl">💬</span>
                      Active Conversations
                      <span className="text-sm font-normal text-slate-400">({activeLeads.length})</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {activeLeads.map(lead => (
                        <LeadCard 
                          key={lead.id}
                          lead={lead as Lead}
                          onClick={() => setSelectedLeadId(lead.id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Closed Leads */}
                {closedLeads.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-200">
                      <span className="text-xl">📁</span>
                      Closed
                      <span className="text-sm font-normal text-slate-400">({closedLeads.length})</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {closedLeads.map(lead => (
                        <LeadCard 
                          key={lead.id}
                          lead={lead as Lead}
                          onClick={() => setSelectedLeadId(lead.id)}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
