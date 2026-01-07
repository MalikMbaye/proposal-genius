import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

function logStep(step: string, details?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${step}`, details ? JSON.stringify(details) : '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    logStep('User authenticated', { userId: user.id });

    const { proposalId, proposalText } = await req.json();

    if (!proposalId || !proposalText) {
      throw new Error('Missing proposalId or proposalText');
    }

    logStep('Processing proposal', { proposalId, textLength: proposalText.length });

    // Use AI to detect and redact sensitive information
    const redactionPrompt = `You are a sensitive information redactor. Analyze the following proposal text and replace ALL sensitive information with redaction markers.

REDACT THE FOLLOWING TYPES OF INFORMATION:
1. **Personal Names**: Replace with [REDACTED NAME]
2. **Company/Business Names**: Replace with [REDACTED COMPANY]
3. **Email Addresses**: Replace with [REDACTED EMAIL]
4. **Phone Numbers**: Replace with [REDACTED PHONE]
5. **Physical Addresses**: Replace with [REDACTED ADDRESS]
6. **Dollar Amounts/Prices**: Replace with [REDACTED AMOUNT]
7. **Dates with specific years**: Replace year with [YEAR] (e.g., "January 2024" → "January [YEAR]")
8. **Website URLs/Domains**: Replace with [REDACTED URL]
9. **Social Media Handles**: Replace with [REDACTED HANDLE]
10. **Project-specific codenames**: Replace with [REDACTED PROJECT]

IMPORTANT RULES:
- Keep the document structure and formatting intact
- Preserve generic terms like "the client", "our team", etc.
- Keep industry terms, methodologies, and general business language
- Do NOT redact common words or generic descriptions
- Maintain paragraph breaks and bullet points

Return ONLY the redacted text, nothing else. No explanations.

PROPOSAL TEXT:
${proposalText}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: redactionPrompt }
        ],
        max_tokens: 8000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      logStep('AI API error', { status: aiResponse.status, error: errorText });
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const redactedText = aiData.choices?.[0]?.message?.content || '';

    logStep('Redaction complete', { 
      originalLength: proposalText.length, 
      redactedLength: redactedText.length 
    });

    // Count redactions
    const redactionCounts = {
      names: (redactedText.match(/\[REDACTED NAME\]/g) || []).length,
      companies: (redactedText.match(/\[REDACTED COMPANY\]/g) || []).length,
      emails: (redactedText.match(/\[REDACTED EMAIL\]/g) || []).length,
      phones: (redactedText.match(/\[REDACTED PHONE\]/g) || []).length,
      addresses: (redactedText.match(/\[REDACTED ADDRESS\]/g) || []).length,
      amounts: (redactedText.match(/\[REDACTED AMOUNT\]/g) || []).length,
      urls: (redactedText.match(/\[REDACTED URL\]/g) || []).length,
      years: (redactedText.match(/\[YEAR\]/g) || []).length,
    };

    const totalRedactions = Object.values(redactionCounts).reduce((a, b) => a + b, 0);

    logStep('Redaction summary', redactionCounts);

    // Update the proposal record
    const { error: updateError } = await supabase
      .from('uploaded_proposals')
      .update({
        status: 'completed',
        redaction_summary: {
          counts: redactionCounts,
          total: totalRedactions,
          processed_at: new Date().toISOString(),
        },
      })
      .eq('id', proposalId)
      .eq('user_id', user.id);

    if (updateError) {
      logStep('Update error', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        redactedText,
        summary: {
          counts: redactionCounts,
          total: totalRedactions,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logStep('Error', { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
