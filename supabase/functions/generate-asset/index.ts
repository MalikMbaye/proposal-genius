import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ASSET_PROMPTS: Record<string, string> = {
  deckPrompt: `You are an expert at creating AI presentation prompts for GenSpark AI Slides.

Generate a COMPLETE prompt for GenSpark AI Slides with slide-by-slide content:
- Title Slide
- Problem Slide  
- Why This Matters
- Our Approach
- Solution Details (3 slides)
- Timeline
- Investment Options
- Why Us
- Next Steps

Include specific design direction and visual suggestions. Make it comprehensive and ready to paste directly into GenSpark.`,

  contract: `You are an expert business contract writer.

Generate a professional services agreement contract with:
- Scope of work (based on the proposal context)
- Timeline and milestones
- Payment terms
- Section 3: What Contractor Is Responsible For (with checkmarks)
- Section 4: What Client Is Responsible For (with checkmarks)
- Section 5: What Success Requires (acknowledging why systems fail)
- Warranty section (what IS and IS NOT guaranteed)
- Critical line: "This is a SYSTEM BUILD, not a guarantee of specific business outcomes."
- What's NOT Included section with change order process`,

  contractEmail: `You are an expert business email writer.

Generate a brief professional email (2-3 paragraphs) to accompany contract delivery. It should:
- Reference the proposal discussion
- Explain what's attached
- Set clear next steps
- Be warm but professional`,

  invoiceDescription: `You are an expert at writing clear invoice line items.

Generate a clear invoice line item description for accounting systems with:
- Scope summary
- Timeline/phase
- Total amount placeholder`,

  proposalEmail: `You are an expert business email writer.

Generate a complete proposal submission email with:
- Subject line
- Warm opening referencing the meeting
- Meeting recap highlights
- What's included/attached
- Clear next steps (1-2-3 format)
- Availability for questions
- Professional closing`,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const assetType = body.assetType || '';
    const clientContext = body.clientContext || '';
    const background = body.background || '';
    const caseStudies = body.caseStudies || '';
    const pricing = body.pricing || { strategy: '', ai: '', managed: '' };
    const proposalContent = body.proposalContent || '';

    console.log('Generating single asset:', assetType);

    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const systemPrompt = ASSET_PROMPTS[assetType];
    if (!systemPrompt) {
      throw new Error(`Unknown asset type: ${assetType}`);
    }

    const userPrompt = `Generate this deliverable based on the following context:

CLIENT CONTEXT:
${clientContext}

MY BACKGROUND:
${background}

CASE STUDIES TO REFERENCE:
${caseStudies}

PRICING GUIDANCE:
- Strategy & Training: ${pricing.strategy}
- Strategy + AI Systems: ${pricing.ai}
- Fully Managed: ${pricing.managed}

${proposalContent ? `PROPOSAL ALREADY GENERATED (reference this for consistency):
${proposalContent.slice(0, 3000)}...` : ''}

Generate only the requested deliverable, formatted with proper markdown.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 401) {
        return new Response(JSON.stringify({ error: 'Invalid API key.' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    console.log('Generated asset:', assetType, 'length:', content.length);

    return new Response(JSON.stringify({ success: true, content, assetType }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-asset function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
