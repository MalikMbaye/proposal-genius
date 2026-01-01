import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScreenshotDropZone, type AnalysisResult, type DMAnalysis } from './ScreenshotDropZone';
import { ResponseOptions } from './ResponseOptions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Phone, ChevronDown, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Lead } from './LeadCard';
import { toast } from 'sonner';
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

interface LeadThreadProps {
  leadId: string;
  onBack: () => void;
}

interface Snapshot {
  id: string;
  analysis: DMAnalysis;
  created_at: string;
  response_used: string | null;
}

const statusConfig: Record<string, { emoji: string }> = {
  cold: { emoji: '❄️' },
  warm: { emoji: '🟡' },
  hot: { emoji: '🔥' },
  qualified: { emoji: '✅' },
  proposal_sent: { emoji: '📝' },
  closed: { emoji: '🎉' },
  lost: { emoji: '❌' },
};

export function LeadThread({ leadId, onBack }: LeadThreadProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<DMAnalysis | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeadData();
  }, [leadId]);

  const fetchLeadData = async () => {
    setLoading(true);
    
    // Fetch lead
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .maybeSingle();
    
    if (leadError) {
      console.error('Error fetching lead:', leadError);
      toast.error('Failed to load lead');
      onBack();
      return;
    }

    if (!leadData) {
      toast.error('Lead not found');
      onBack();
      return;
    }

    setLead(leadData as Lead);

    // Fetch snapshots
    const { data: snapshotData } = await supabase
      .from('dm_snapshots')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    const typedSnapshots = (snapshotData || []).map(s => ({
      id: s.id,
      analysis: s.analysis as unknown as DMAnalysis,
      created_at: s.created_at,
      response_used: s.response_used,
    }));
    setSnapshots(typedSnapshots);
    
    if (typedSnapshots.length > 0) {
      setLatestAnalysis(typedSnapshots[0].analysis);
    }

    setLoading(false);
  };

  const handleScreenshotAnalyzed = (result: AnalysisResult) => {
    setLatestAnalysis(result.analysis);
    fetchLeadData();
  };

  const handleGenerateProposal = () => {
    // Navigate to proposal generator with pre-filled context
    const params = new URLSearchParams({
      clientName: lead?.name || '',
      situation: lead?.goals || '',
      source: 'dm_lead',
      leadId: lead?.id || '',
    });
    
    navigate(`/generate?${params.toString()}`);
  };

  const handleDeleteLead = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      toast.success('Lead deleted');
      onBack();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  const isReadyForProposal = lead.status === 'qualified' || lead.status === 'hot';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{lead.name}</h1>
            <span className="text-2xl">
              {statusConfig[lead.status]?.emoji || '❄️'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Score: <span className="font-mono font-medium text-foreground">{lead.qualification_score || 0}/10</span>
            <span className="mx-2">•</span>
            {lead.current_stage || 'Opening'}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {lead.name}? This will also delete all conversation history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteLead} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Screenshot Drop Zone */}
      <ScreenshotDropZone
        leadId={leadId}
        onAnalyzed={handleScreenshotAnalyzed}
        className="mb-6"
        compact={snapshots.length > 0}
      />

      {/* Response Options */}
      {latestAnalysis && (
        <ResponseOptions 
          analysis={latestAnalysis}
          className="mb-6"
        />
      )}

      {/* Context Summary */}
      {(lead.goals || lead.pain_points?.length || lead.budget_range || lead.timeline) && (
        <div className="mb-6 p-4 bg-muted/30 rounded-xl space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground mb-3">Extracted Context</h3>
          {lead.goals && (
            <p className="text-sm"><span className="font-medium">Goals:</span> {lead.goals}</p>
          )}
          {lead.pain_points && lead.pain_points.length > 0 && (
            <p className="text-sm"><span className="font-medium">Pain Points:</span> {lead.pain_points.join(', ')}</p>
          )}
          {lead.budget_range && (
            <p className="text-sm"><span className="font-medium">Budget:</span> {lead.budget_range}</p>
          )}
          {lead.timeline && (
            <p className="text-sm"><span className="font-medium">Timeline:</span> {lead.timeline}</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {isReadyForProposal && (
        <div className="flex gap-4 mb-6">
          <Button
            onClick={handleGenerateProposal}
            className="flex-1 gap-2"
          >
            <FileText className="h-4 w-4" />
            Generate Proposal
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            disabled
          >
            <Phone className="h-4 w-4" />
            Generate Call Script
            <span className="text-xs text-muted-foreground">(Coming soon)</span>
          </Button>
        </div>
      )}

      {/* History */}
      {snapshots.length > 1 && (
        <div className="border-t border-border pt-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showHistory ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            View Conversation History ({snapshots.length} exchanges)
          </button>
          
          {showHistory && (
            <div className="mt-4 space-y-4">
              {snapshots.map((snapshot, idx) => (
                <div key={snapshot.id} className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
                    Exchange {snapshots.length - idx}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {snapshot.analysis?.conversation_text || 'No text extracted'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
