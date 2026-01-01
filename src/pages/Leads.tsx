import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScreenshotDropZone, type AnalysisResult } from '@/components/leads/ScreenshotDropZone';
import { LeadCard, type Lead } from '@/components/leads/LeadCard';
import { LeadThread } from '@/components/leads/LeadThread';
import { Navbar } from '@/components/Navbar';
import { Loader2, Users, MessageSquareText } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('last_activity', { ascending: false });
    
    if (!error) {
      setLeads((data || []) as Lead[]);
    }
    setLoading(false);
  };

  const handleScreenshotAnalyzed = (result: AnalysisResult) => {
    if (result.isNewLead) {
      fetchLeads();
    }
    setSelectedLeadId(result.leadId);
  };

  const handleBackFromThread = () => {
    setSelectedLeadId(null);
    fetchLeads();
  };

  // Group leads by status
  const activeLeads = leads.filter(l => !['qualified', 'proposal_sent', 'closed', 'lost'].includes(l.status));
  const qualifiedLeads = leads.filter(l => l.status === 'qualified' || l.status === 'proposal_sent');
  const closedLeads = leads.filter(l => l.status === 'closed' || l.status === 'lost');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {selectedLeadId ? (
          <LeadThread 
            leadId={selectedLeadId} 
            onBack={handleBackFromThread}
          />
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                Leads
              </h1>
              <p className="text-muted-foreground">
                Drop a DM screenshot to get AI-powered response suggestions
              </p>
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
            ) : leads.length === 0 ? (
              <div className="text-center py-16 px-4">
                <MessageSquareText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No leads yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Drop your first DM screenshot above to get started. The AI will extract the prospect's name,
                  analyze the conversation, and give you 3 response options to copy-paste.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Active Leads */}
                {activeLeads.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="text-xl">💬</span>
                      Active Conversations
                      <span className="text-sm font-normal text-muted-foreground">({activeLeads.length})</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {activeLeads.map(lead => (
                        <LeadCard 
                          key={lead.id}
                          lead={lead}
                          onClick={() => setSelectedLeadId(lead.id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Qualified Leads */}
                {qualifiedLeads.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="text-xl">✅</span>
                      Ready for Proposal
                      <span className="text-sm font-normal text-muted-foreground">({qualifiedLeads.length})</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {qualifiedLeads.map(lead => (
                        <LeadCard 
                          key={lead.id}
                          lead={lead}
                          onClick={() => setSelectedLeadId(lead.id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Closed Leads */}
                {closedLeads.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="text-xl">📁</span>
                      Closed
                      <span className="text-sm font-normal text-muted-foreground">({closedLeads.length})</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {closedLeads.map(lead => (
                        <LeadCard 
                          key={lead.id}
                          lead={lead}
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
      </main>
    </div>
  );
}
