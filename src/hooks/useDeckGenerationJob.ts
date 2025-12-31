import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface DeckJob {
  id: string;
  user_id: string;
  proposal_id: string | null;
  manus_task_id: string | null;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  deck_prompt: string | null;
  client_name: string | null;
  num_slides: number;
  result_url: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

interface UseDeckGenerationJobOptions {
  proposalId?: string;
  onComplete?: (job: DeckJob) => void;
  onError?: (error: string) => void;
}

export function useDeckGenerationJob(options: UseDeckGenerationJobOptions = {}) {
  const { proposalId, onComplete, onError } = options;
  const [currentJob, setCurrentJob] = useState<DeckJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
      }
    };
  }, []);

  // Check for existing active job on mount
  useEffect(() => {
    const checkExistingJob = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Query for any running/pending job for this proposal
      let query = supabase
        .from('deck_generation_jobs')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['pending', 'running'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (proposalId) {
        query = query.eq('proposal_id', proposalId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error checking existing job:', error);
        return;
      }

      if (data && data.length > 0) {
        const job = data[0] as DeckJob;
        setCurrentJob(job);
        // Resume polling if job is still active
        if (job.status === 'pending' || job.status === 'running') {
          startPolling(job.id, job.manus_task_id);
        }
      }
    };

    checkExistingJob();
  }, [proposalId]);

  // Subscribe to realtime updates for the current job
  useEffect(() => {
    if (!currentJob?.id) return;

    const channel = supabase
      .channel(`deck-job-${currentJob.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'deck_generation_jobs',
          filter: `id=eq.${currentJob.id}`,
        },
        (payload) => {
          const updatedJob = payload.new as DeckJob;
          setCurrentJob(updatedJob);
          
          if (updatedJob.status === 'completed') {
            onComplete?.(updatedJob);
            stopPolling();
          } else if (updatedJob.status === 'failed') {
            onError?.(updatedJob.error_message || 'Unknown error');
            stopPolling();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentJob?.id, onComplete, onError]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback((jobId: string, manusTaskId: string | null) => {
    if (!manusTaskId) return;

    const poll = async () => {
      if (!mountedRef.current) return;

      try {
        // Call the edge function to check status
        const { data, error } = await supabase.functions.invoke('generate-deck', {
          body: { action: 'check', taskId: manusTaskId, jobId },
        });

        if (error) {
          console.error('Poll error:', error);
        }

        // Job status will be updated via realtime subscription
        // Continue polling if still active
        const { data: jobData } = await supabase
          .from('deck_generation_jobs')
          .select('status')
          .eq('id', jobId)
          .single();

        if (jobData && (jobData.status === 'pending' || jobData.status === 'running')) {
          pollingRef.current = setTimeout(poll, 5000);
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Retry after a delay
        pollingRef.current = setTimeout(poll, 10000);
      }
    };

    // Start polling
    pollingRef.current = setTimeout(poll, 5000);
  }, []);

  const startGeneration = useCallback(async (params: {
    deckPrompt: string;
    clientName: string;
    numSlides?: number;
    proposalId?: string;
  }) => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to generate a deck');
      }

      // Create job record in database
      const { data: job, error: insertError } = await supabase
        .from('deck_generation_jobs')
        .insert({
          user_id: user.id,
          proposal_id: params.proposalId || proposalId || null,
          status: 'pending',
          progress: 0,
          deck_prompt: params.deckPrompt,
          client_name: params.clientName,
          num_slides: params.numSlides || 10,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newJob = job as DeckJob;
      setCurrentJob(newJob);

      // Call edge function to start generation
      const { data, error } = await supabase.functions.invoke('generate-deck', {
        body: {
          action: 'create',
          jobId: newJob.id,
          deckPrompt: params.deckPrompt,
          clientName: params.clientName,
          numSlides: params.numSlides || 10,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Update job with manus task ID
      const { error: updateError } = await supabase
        .from('deck_generation_jobs')
        .update({
          manus_task_id: data.taskId,
          status: 'running',
          progress: 5,
        })
        .eq('id', newJob.id);

      if (updateError) {
        console.error('Error updating job with task ID:', updateError);
      }

      // Start polling for completion
      startPolling(newJob.id, data.taskId);

      toast({
        title: "Generating slide deck...",
        description: "This typically takes 5-7 minutes. Feel free to switch tabs.",
      });

      return newJob;
    } catch (error) {
      console.error('Start generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start generation';
      
      // Update job status to failed if we have one
      if (currentJob?.id) {
        await supabase
          .from('deck_generation_jobs')
          .update({
            status: 'failed',
            error_message: errorMessage,
          })
          .eq('id', currentJob.id);
      }

      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });

      onError?.(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [proposalId, startPolling, currentJob?.id, onError]);

  const cancelGeneration = useCallback(async () => {
    if (!currentJob?.id) return;

    stopPolling();

    await supabase
      .from('deck_generation_jobs')
      .update({
        status: 'failed',
        error_message: 'Cancelled by user',
      })
      .eq('id', currentJob.id);

    setCurrentJob(null);
  }, [currentJob?.id, stopPolling]);

  const clearJob = useCallback(() => {
    stopPolling();
    setCurrentJob(null);
  }, [stopPolling]);

  return {
    currentJob,
    isLoading,
    isGenerating: currentJob?.status === 'pending' || currentJob?.status === 'running',
    startGeneration,
    cancelGeneration,
    clearJob,
  };
}
