import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MANUS_API_URL = 'https://api.manus.ai/v1';

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
    const { action, taskId, deckPrompt, clientName, numSlides = 10 } = body;

    // Action: check - Poll for task status
    if (action === 'check' && taskId) {
      console.log(`Checking status for task ${taskId}`);
      
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
        
        // If no PDF found, check if there's a share URL we can use instead
        if (!pdfUrl) {
          console.log('No PDF URL found in output, checking for alternative URLs...');
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
        return new Response(JSON.stringify({
          success: false,
          status: 'failed',
          error: data.error || 'Task failed',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Still running or pending
      return new Response(JSON.stringify({
        success: true,
        status: data.status,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: create (default) - Start a new deck generation task
    if (!deckPrompt) {
      throw new Error('deckPrompt is required');
    }

    console.log('Starting Manus deck generation for:', clientName);

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

    // Create the task
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
      throw new Error(`Failed to start deck generation: ${errorText}`);
    }

    const createData: ManusTaskResponse = await createResponse.json();
    console.log('Manus task created:', createData);

    const generatedTaskId = createData.task_id;
    if (!generatedTaskId) {
      throw new Error(`Manus did not return task_id. Response: ${JSON.stringify(createData)}`);
    }

    console.log('Task started with ID:', generatedTaskId);

    // Return immediately with task info - client will poll for completion
    return new Response(JSON.stringify({
      success: true,
      status: 'started',
      taskId: generatedTaskId,
      taskUrl: createData.task_url,
      shareUrl: createData.share_url,
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
