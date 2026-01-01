import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MANUS_API_URL = 'https://api.manus.ai/v1';
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 5000]; // Exponential backoff delays in ms

// Helper for retrying API calls with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delays: number[] = RETRY_DELAYS
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`Attempt ${attempt + 1} failed: ${lastError.message}`);
      
      if (attempt < maxRetries) {
        const delay = delays[Math.min(attempt, delays.length - 1)];
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

interface ManusTaskResponse {
  task_id: string;
  task_title: string;
  task_url: string;
  share_url?: string;
}

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

// Create Supabase client for updating job status
function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Update job progress in database
async function updateJobProgress(jobId: string, progress: number, status?: string) {
  if (!jobId) return;
  
  const supabase = getSupabaseClient();
  const updates: Record<string, unknown> = { progress };
  if (status) updates.status = status;
  
  const { error } = await supabase
    .from('deck_generation_jobs')
    .update(updates)
    .eq('id', jobId);
    
  if (error) {
    console.error('Error updating job progress:', error);
  }
}

// Mark job as completed
async function completeJob(jobId: string, resultUrl: string | null) {
  if (!jobId) return;
  
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('deck_generation_jobs')
    .update({
      status: 'completed',
      progress: 100,
      result_url: resultUrl,
      completed_at: new Date().toISOString(),
    })
    .eq('id', jobId);
    
  if (error) {
    console.error('Error completing job:', error);
  }
}

// Mark job as failed
async function failJob(jobId: string, errorMessage: string) {
  if (!jobId) return;
  
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('deck_generation_jobs')
    .update({
      status: 'failed',
      error_message: errorMessage,
    })
    .eq('id', jobId);
    
  if (error) {
    console.error('Error failing job:', error);
  }
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

    const body = await req.json();
    const { action, taskId, jobId, deckPrompt, clientName, numSlides = 10 } = body;

    // Action: check - Poll for task status
    if (action === 'check' && taskId) {
      console.log(`Checking status for task ${taskId}, job ${jobId}`);
      
      const response = await fetch(`${MANUS_API_URL}/tasks/${taskId}`, {
        method: 'GET',
        headers: {
          'API_KEY': MANUS_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Manus status check error:', response.status, errorText);
        throw new Error(`Manus API error: ${response.status}`);
      }

      const data: ManusTaskStatus = await response.json();
      console.log(`Task ${taskId} status: ${data.status}`);

      if (data.status === 'completed') {
        console.log('Task output:', JSON.stringify(data.output, null, 2));
        const pdfUrl = extractPdfUrl(data.output);
        console.log('Extracted PDF URL:', pdfUrl);
        
        // Update job in database
        if (jobId) {
          await completeJob(jobId, pdfUrl);
        }
        
        return new Response(JSON.stringify({
          success: true,
          status: 'completed',
          pdfUrl,
          hasOutput: !!data.output,
          outputLength: data.output?.length || 0,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (data.status === 'failed') {
        const errorMsg = data.error || 'Task failed';
        if (jobId) {
          await failJob(jobId, errorMsg);
        }
        
        return new Response(JSON.stringify({
          success: false,
          status: 'failed',
          error: errorMsg,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Still running or pending - update progress estimate
      if (jobId && data.status === 'running') {
        // Estimate progress based on typical 5-7 minute generation time
        await updateJobProgress(jobId, 15, 'running');
      }

      return new Response(JSON.stringify({
        success: true,
        status: data.status,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: create - Start a new deck generation task
    if (!deckPrompt) {
      throw new Error('deckPrompt is required');
    }

    console.log('Starting Manus deck generation for:', clientName, 'Job ID:', jobId);

    // Update job status to running if we have a job ID
    if (jobId) {
      await updateJobProgress(jobId, 5, 'running');
    }

    // Create the presentation prompt for Manus
    const fullPrompt = `Create a professional presentation slide deck (${numSlides} slides) for a client proposal.

CLIENT: ${clientName || 'Client'}

PRESENTATION REQUIREMENTS:
${deckPrompt}

IMPORTANT INSTRUCTIONS:
1. Create a visually stunning, professional presentation
2. Use modern design with clean layouts
3. Include data visualizations, charts, and graphics where appropriate
4. Export the final presentation as a PDF file
5. Make it presentation-ready with consistent branding

Please create this presentation and provide the PDF download.`;

    console.log('Sending request to Manus API...');

    // Create the task with retry logic
    const createData = await retryWithBackoff(async () => {
      const createResponse = await fetch(`${MANUS_API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'API_KEY': MANUS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          agentProfile: 'manus-1.5',
          hideInTaskList: true,
          createShareableLink: true,
        }),
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Manus create error:', createResponse.status, errorText);
        
        // Only retry on 5xx errors or rate limits, not client errors
        if (createResponse.status >= 500 || createResponse.status === 429) {
          throw new Error(`Manus API error (${createResponse.status}): ${errorText}`);
        }
        
        // For 4xx errors (except 429), don't retry
        if (jobId) {
          await failJob(jobId, `Failed to start deck generation: ${errorText}`);
        }
        throw new Error(`Failed to start deck generation: ${errorText}`);
      }

      return await createResponse.json() as ManusTaskResponse;
    }).catch(async (error) => {
      // If all retries failed, mark job as failed
      if (jobId) {
        await failJob(jobId, error.message);
      }
      throw error;
    });
    console.log('Manus task created:', createData);

    const generatedTaskId = createData.task_id;
    if (!generatedTaskId) {
      const errorMsg = `Manus did not return task_id. Response: ${JSON.stringify(createData)}`;
      if (jobId) {
        await failJob(jobId, errorMsg);
      }
      throw new Error(errorMsg);
    }

    console.log('Task started with ID:', generatedTaskId);

    // Update job with the Manus task ID
    if (jobId) {
      const supabase = getSupabaseClient();
      await supabase
        .from('deck_generation_jobs')
        .update({
          manus_task_id: generatedTaskId,
          progress: 10,
        })
        .eq('id', jobId);
    }

    // Return immediately with task info - client will poll for completion
    return new Response(JSON.stringify({
      success: true,
      status: 'started',
      taskId: generatedTaskId,
      taskUrl: createData.task_url,
      shareUrl: createData.share_url,
      jobId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Deck generation error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});