import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MANUS_API_URL = 'https://api.manus.ai/v1';

interface ManusTaskStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
  output?: Array<{
    id: string;
    status: string;
    role: string;
    type: string;
    content: Array<{
      type: string;
      text?: string;
      fileUrl?: string;
      fileName?: string;
      mimeType?: string;
    }>;
  }>;
}

interface DeckJob {
  id: string;
  user_id: string;
  manus_task_id: string;
  status: string;
  progress: number;
  created_at: string;
  client_name: string | null;
  proposal_id: string | null;
}

function extractPdfUrl(taskOutput: ManusTaskStatus['output']): string | null {
  if (!taskOutput) return null;
  
  for (const output of taskOutput) {
    if (output.content) {
      for (const content of output.content) {
        if (content.fileUrl && content.mimeType?.includes('pdf')) {
          return content.fileUrl;
        }
        if (content.fileUrl && content.fileName?.toLowerCase().endsWith('.pdf')) {
          return content.fileUrl;
        }
      }
    }
  }
  
  // If no PDF found, look for any file URL
  for (const output of taskOutput) {
    if (output.content) {
      for (const content of output.content) {
        if (content.fileUrl) {
          return content.fileUrl;
        }
      }
    }
  }
  
  return null;
}

function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseServiceKey);
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 2000;

async function checkManusTask(taskId: string, apiKey: string): Promise<ManusTaskStatus | null> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${MANUS_API_URL}/tasks/${taskId}`, {
        method: 'GET',
        headers: {
          'API_KEY': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Only retry on 5xx errors or rate limits
        if (response.status >= 500 || response.status === 429) {
          throw new Error(`Manus API error: ${response.status}`);
        }
        console.error(`Manus API error for task ${taskId}:`, response.status);
        return null;
      }

      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`Attempt ${attempt + 1} to check task ${taskId} failed: ${lastError.message}`);
      
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  
  console.error(`All retries failed for task ${taskId}:`, lastError);
  return null;
}

async function sendCompletionEmail(job: DeckJob, pdfUrl: string | null, supabase: ReturnType<typeof getSupabaseClient>) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Call the send-deck-notification function
    const response = await fetch(`${supabaseUrl}/functions/v1/send-deck-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        jobId: job.id,
        userId: job.user_id,
        clientName: job.client_name,
        resultUrl: pdfUrl,
        proposalId: job.proposal_id,
      }),
    });

    const result = await response.json();
    console.log(`Email notification result for job ${job.id}:`, result);
  } catch (error) {
    console.error(`Failed to send email for job ${job.id}:`, error);
    // Don't throw - email failure shouldn't break the job completion
  }
}

async function processJob(job: DeckJob, apiKey: string, supabase: ReturnType<typeof getSupabaseClient>) {
  console.log(`Processing job ${job.id} with Manus task ${job.manus_task_id}`);
  
  const taskStatus = await checkManusTask(job.manus_task_id, apiKey);
  
  if (!taskStatus) {
    console.log(`Could not get status for job ${job.id}, will retry later`);
    return;
  }

  console.log(`Job ${job.id} Manus status: ${taskStatus.status}`);

  if (taskStatus.status === 'completed') {
    const pdfUrl = extractPdfUrl(taskStatus.output);
    console.log(`Job ${job.id} completed with PDF URL: ${pdfUrl}`);
    
    const { error } = await supabase
      .from('deck_generation_jobs')
      .update({
        status: 'completed',
        progress: 100,
        result_url: pdfUrl,
        completed_at: new Date().toISOString(),
      })
      .eq('id', job.id);

    if (error) {
      console.error(`Error updating completed job ${job.id}:`, error);
    } else {
      console.log(`Successfully marked job ${job.id} as completed`);
      
      // Send email notification
      await sendCompletionEmail(job, pdfUrl, supabase);
    }
  } else if (taskStatus.status === 'failed') {
    const errorMsg = taskStatus.error || 'Manus task failed';
    console.log(`Job ${job.id} failed: ${errorMsg}`);
    
    const { error } = await supabase
      .from('deck_generation_jobs')
      .update({
        status: 'failed',
        error_message: errorMsg,
      })
      .eq('id', job.id);

    if (error) {
      console.error(`Error updating failed job ${job.id}:`, error);
    }
  } else if (taskStatus.status === 'running') {
    // Estimate progress based on time elapsed (5-7 min typical)
    const createdAt = new Date(job.created_at).getTime();
    const now = Date.now();
    const elapsedMinutes = (now - createdAt) / 1000 / 60;
    const estimatedProgress = Math.min(90, Math.floor(10 + (elapsedMinutes / 6) * 80));
    
    if (estimatedProgress > job.progress) {
      const { error } = await supabase
        .from('deck_generation_jobs')
        .update({
          status: 'running',
          progress: estimatedProgress,
        })
        .eq('id', job.id);

      if (error) {
        console.error(`Error updating progress for job ${job.id}:`, error);
      } else {
        console.log(`Updated job ${job.id} progress to ${estimatedProgress}%`);
      }
    }
  }
  // For 'pending' status, we just wait for it to start running
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MANUS_API_KEY = Deno.env.get('MANUS_API_KEY');
    if (!MANUS_API_KEY) {
      throw new Error('MANUS_API_KEY is not configured');
    }

    const supabase = getSupabaseClient();

    // Fetch all pending/running jobs that have a manus_task_id
    const { data: jobs, error: fetchError } = await supabase
      .from('deck_generation_jobs')
      .select('id, user_id, manus_task_id, status, progress, created_at, client_name, proposal_id')
      .in('status', ['pending', 'running'])
      .not('manus_task_id', 'is', null)
      .order('created_at', { ascending: true })
      .limit(20); // Process up to 20 jobs per cron run

    if (fetchError) {
      throw new Error(`Failed to fetch jobs: ${fetchError.message}`);
    }

    if (!jobs || jobs.length === 0) {
      console.log('No pending/running jobs to process');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No jobs to process',
        processed: 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${jobs.length} jobs to process`);

    // Process jobs sequentially to avoid rate limiting Manus API
    let processed = 0;
    let completed = 0;
    let failed = 0;

    for (const job of jobs) {
      await processJob(job as DeckJob, MANUS_API_KEY, supabase);
      processed++;
      
      // Small delay between API calls to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Re-fetch to count final statuses
    const { data: updatedJobs } = await supabase
      .from('deck_generation_jobs')
      .select('status')
      .in('id', jobs.map(j => j.id));

    if (updatedJobs) {
      completed = updatedJobs.filter(j => j.status === 'completed').length;
      failed = updatedJobs.filter(j => j.status === 'failed').length;
    }

    console.log(`Processed ${processed} jobs: ${completed} completed, ${failed} failed`);

    return new Response(JSON.stringify({ 
      success: true,
      processed,
      completed,
      failed,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Poll deck jobs error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
