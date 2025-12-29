import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GAMMA_API_URL = 'https://public-api.gamma.app/v1.0/generations';

interface GammaGenerateRequest {
  inputText: string;
  textMode: string;
  format: string;
  numCards?: number;
  exportAs?: string;
  themeId?: string;
  additionalInstructions?: string;
  textOptions?: {
    amount?: string;
    tone?: string;
    audience?: string;
    language?: string;
  };
  imageOptions?: {
    source?: string;
  };
}

interface GammaResponse {
  id: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  result?: {
    gammaUrl?: string;
    pdfUrl?: string;
    pptxUrl?: string;
    thumbnailUrl?: string;
  };
  error?: string;
}

async function pollForCompletion(generationId: string, apiKey: string, maxAttempts = 60): Promise<GammaResponse> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    console.log(`Polling attempt ${attempt + 1} for generation ${generationId}`);
    
    const response = await fetch(`${GAMMA_API_URL}/${generationId}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gamma poll error:', response.status, errorText);
      throw new Error(`Gamma API error: ${response.status}`);
    }

    const data: GammaResponse = await response.json();
    console.log(`Generation status: ${data.status}`);

    if (data.status === 'completed') {
      return data;
    }

    if (data.status === 'failed') {
      throw new Error(data.error || 'Deck generation failed');
    }

    // Wait 5 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  throw new Error('Deck generation timed out');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GAMMA_API_KEY = Deno.env.get('GAMMA_API_KEY');
    if (!GAMMA_API_KEY) {
      throw new Error('GAMMA_API_KEY is not configured');
    }

    const { deckPrompt, clientName, numSlides = 10 } = await req.json();

    if (!deckPrompt) {
      throw new Error('deckPrompt is required');
    }

    console.log('Starting Gamma deck generation for:', clientName);

    // Create generation request - omit themeId to use Gamma's default
    const generatePayload: GammaGenerateRequest = {
      inputText: deckPrompt,
      textMode: 'generate',
      format: 'presentation',
      numCards: numSlides,
      exportAs: 'pdf',
      additionalInstructions: 'Create a professional, visually appealing presentation with clear sections and engaging visuals.',
      textOptions: {
        amount: 'detailed',
        tone: 'professional, compelling',
        audience: 'business stakeholders',
        language: 'en',
      },
      imageOptions: {
        source: 'aiGenerated',
      },
    };

    console.log('Sending request to Gamma API...');

    const createResponse = await fetch(GAMMA_API_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': GAMMA_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(generatePayload),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Gamma create error:', createResponse.status, errorText);
      throw new Error(`Failed to start deck generation: ${errorText}`);
    }

    const createData = await createResponse.json();
    const generationId = createData.id;

    console.log('Generation started with ID:', generationId);

    // Poll for completion
    const completedGeneration = await pollForCompletion(generationId, GAMMA_API_KEY);

    console.log('Generation completed:', completedGeneration);

    return new Response(JSON.stringify({
      success: true,
      generationId,
      gammaUrl: completedGeneration.result?.gammaUrl,
      pdfUrl: completedGeneration.result?.pdfUrl,
      pptxUrl: completedGeneration.result?.pptxUrl,
      thumbnailUrl: completedGeneration.result?.thumbnailUrl,
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
