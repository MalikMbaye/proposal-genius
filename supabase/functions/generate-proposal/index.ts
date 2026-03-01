import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Cost per 1K tokens (in cents)
const COST_PER_1K_INPUT_TOKENS = 0.3;
const COST_PER_1K_OUTPUT_TOKENS = 1.5;

// Track API usage
async function trackUsage(userId: string, inputTokens: number, outputTokens: number) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const totalTokens = inputTokens + outputTokens;
  const estimatedCostCents = Math.round(
    (inputTokens / 1000) * COST_PER_1K_INPUT_TOKENS +
    (outputTokens / 1000) * COST_PER_1K_OUTPUT_TOKENS
  );

  const { error } = await supabase
    .from('api_usage_tracking')
    .insert({
      user_id: userId,
      function_name: 'generate-proposal',
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: totalTokens,
      estimated_cost_cents: estimatedCostCents,
    });

  if (error) {
    console.error('Error tracking usage:', error);
  } else {
    console.log(`[USAGE] Tracked ${totalTokens} tokens (${estimatedCostCents} cents) for user ${userId}`);
  }
}

// Check if user is over their usage limit
async function checkUsageLimit(userId: string): Promise<{ allowed: boolean; message?: string }> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: usageData } = await supabase
    .from('api_usage_tracking')
    .select('total_tokens')
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  const currentUsage = (usageData || []).reduce((sum, r) => sum + (r.total_tokens || 0), 0);

  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('subscription_type, status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  const limits: Record<string, number> = {
    free: 50000,
    pro_monthly: 1000000,
    lifetime: 2000000,
  };

  const subscriptionType = subscription?.subscription_type || 'free';
  const limit = limits[subscriptionType] || limits.free;

  if (currentUsage >= limit) {
    return {
      allowed: false,
      message: `You've reached your monthly token limit (${currentUsage.toLocaleString()}/${limit.toLocaleString()}). Please upgrade your plan for more usage.`,
    };
  }

  return { allowed: true };
}

const ANONYMOUS_FREE_LIMIT = 2;

async function checkAnonymousRateLimit(clientIp: string): Promise<{ allowed: boolean; message?: string; remaining: number }> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { count } = await supabase
    .from('proposal_usage')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', clientIp)
    .is('user_id', null);

  const usageCount = count || 0;
  const remaining = Math.max(0, ANONYMOUS_FREE_LIMIT - usageCount);

  if (usageCount >= ANONYMOUS_FREE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      message: `You've reached the free limit of ${ANONYMOUS_FREE_LIMIT} proposals. Please sign up for an account to continue.`,
    };
  }

  return { allowed: true, remaining };
}

async function recordAnonymousUsage(clientIp: string): Promise<void> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { error } = await supabase
    .from('proposal_usage')
    .insert({ ip_address: clientIp, user_id: null });

  if (error) {
    console.error('Error recording anonymous usage:', error);
  }
}

function getClientIp(req: Request): string {
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return cfConnectingIp || (forwardedFor?.split(',')[0]?.trim()) || realIp || 'unknown';
}

const PROPOSAL_SYSTEM_PROMPT = `You are an expert business proposal writer. Your proposals follow a narrative-driven, detailed style that prioritizes depth over conciseness.

## Length Options

Respect the user's length preference:

**SHORT (5-7 pages)**: Executive summary, combined problem+solution, condensed execution, pricing table only, brief credentials, quick next steps.

**MEDIUM (10-12 pages)** [DEFAULT]: Full executive summary, problem assessment with key points, solution overview, phased execution (high-level), pricing scenarios with explanations, 1-2 case studies, clear next steps.

**LONG (15-20 pages)**: Comprehensive executive summary, deep problem diagnosis, detailed solution, full phased execution with deliverables, multiple pricing scenarios with full breakdowns, complete credentials, detailed onboarding.

**DETAILED (20-30+ pages)**: Everything in LONG plus week-by-week plans, technical specs, expanded risk mitigation, full terms, appendices.

## Complete Deliverables Package

Generate ALL of these with clear section headers:

### 1. PROPOSAL DOCUMENT
Full proposal with: Executive Summary, Problem Assessment/Reality Check, Solution/Strategic Approach, Execution Plan, Investment & Pricing (with risk mitigation), Why Us/Qualifications, Next Steps.

### 2. PRESENTATION DECK PROMPT
Generate a presentation-optimized prompt with VISUAL-FIRST formatting. This is critical for professional output.

**VISUAL FORMATTING RULES (MANDATORY):**

1. **FLOW DIAGRAMS for Processes**: Any multi-step process MUST be described as a visual flow, not bullets.
   - Format: "Create a FLOW DIAGRAM showing: [Step 1] → [Step 2] → [Step 3] → [Outcome]"

2. **GROUPED CARD LAYOUTS for Related Items**: Lists of 3-6 related concepts MUST use card layouts.
   - Format: "Display as GROUPED CARDS with icons: Card 1: [Title] - [Description] | Card 2: [Title] - [Description]"

3. **COMPARISON VISUALIZATIONS for Options**: Any before/after or multi-option comparison MUST be visual.
   - Format: "Create COMPARISON TABLE or SIDE-BY-SIDE showing: Option A vs Option B vs Option C"

4. **METRIC HIGHLIGHT BOXES for Numbers**: Any statistics or KPIs MUST be in highlight boxes.
   - Format: "Display as LARGE METRIC CALLOUTS: [Number] + [Label] | [Number] + [Label]"

5. **VISUAL HIERARCHY**: Each slide must specify its primary visual element.

**SLIDE STRUCTURE (10-12 slides):**

SLIDE 1 - TITLE: Bold title, client name, your company, date. Specify a hero image theme.
SLIDE 2 - THE CHALLENGE: Use METRIC CALLOUTS for pain point statistics + a brief problem statement.
SLIDE 3 - WHY THIS MATTERS: GROUPED CARDS showing 3-4 consequences of inaction with icons.
SLIDE 4 - OUR APPROACH: FLOW DIAGRAM showing your methodology from discovery → delivery → results.
SLIDE 5 - SOLUTION OVERVIEW: GROUPED CARDS for 3-4 key solution components with icons.
SLIDE 6 - HOW IT WORKS: FLOW DIAGRAM showing implementation steps with timeline markers.
SLIDE 7 - EXPECTED OUTCOMES: METRIC CALLOUTS for projected results + brief context.
SLIDE 8 - TIMELINE: HORIZONTAL FLOW DIAGRAM with phases, durations, and key milestones.
SLIDE 9 - INVESTMENT OPTIONS: COMPARISON TABLE with 2-3 pricing tiers, what's included, and recommended option highlighted.
SLIDE 10 - WHY US: GROUPED CARDS for 3-4 differentiators + METRIC CALLOUTS for credentials.
SLIDE 11 - NEXT STEPS: FLOW DIAGRAM showing: Call → Proposal Review → Contract → Kickoff. Include CTA.

### 3. CONTRACT TEMPLATE
Professional services agreement with scope, timeline, payment terms, responsibility sections, warranty section.

### 4. CONTRACT SUBMISSION MESSAGE
Brief professional email (2-3 paragraphs) to accompany contract delivery.

### 5. INVOICE DESCRIPTION
Clear line item for accounting systems with scope, timeline, phase.

### 6. PROPOSAL SUBMISSION EMAIL
Complete email with: subject line, warm opening, meeting recap, what's included, next steps (1-2-3), availability for questions.

## Writing Style

- Narrative-driven, comprehensive, never sacrifice thoroughness
- Tell compelling story: problem → strategy → execution → outcomes
- Always articulate "why" behind recommendations
- Use specific, concrete language
- Realistic timelines and expectations
- Transparent pricing with clear inclusions/exclusions

## Risk Mitigation (CRITICAL)

ALWAYS include:
- "What YOU Control" vs "What CLIENT Controls" breakdown
- Why systems fail: poor messaging, weak offer, low volume, no optimization
- Outcome language: "Based on similar engagements, clients typically see..." NOT "We guarantee X results"
- Contract sections for responsibilities and warranty
- Critical Legal Line: "This is a SYSTEM BUILD, not a guarantee of specific business outcomes."

## Output Format

Structure output with these EXACT headers (the app parses these):

# PROPOSAL DOCUMENT
[content]

---

# PRESENTATION DECK PROMPT
[content]

---

# CONTRACT TEMPLATE
[content]

---

# CONTRACT SUBMISSION MESSAGE
[content]

---

# INVOICE DESCRIPTION
[content]

---

# PROPOSAL SUBMISSION EMAIL
[content]`;

const PROPOSAL_ONLY_PROMPT = `You are an expert business proposal writer. Your proposals follow a narrative-driven, detailed style that prioritizes depth over conciseness.

## Length Options

Respect the user's length preference:

**SHORT (5-7 pages)**: Executive summary, combined problem+solution, condensed execution, pricing table only, brief credentials, quick next steps.

**MEDIUM (10-12 pages)** [DEFAULT]: Full executive summary, problem assessment with key points, solution overview, phased execution (high-level), pricing scenarios with explanations, 1-2 case studies, clear next steps.

**LONG (15-20 pages)**: Comprehensive executive summary, deep problem diagnosis, detailed solution, full phased execution with deliverables, multiple pricing scenarios with full breakdowns, complete credentials, detailed onboarding.

**DETAILED (20-30+ pages)**: Everything in LONG plus week-by-week plans, technical specs, expanded risk mitigation, full terms, appendices.

## Writing Style

- Narrative-driven, comprehensive, never sacrifice thoroughness
- Tell compelling story: problem → strategy → execution → outcomes
- Always articulate "why" behind recommendations
- Use specific, concrete language
- Realistic timelines and expectations
- Transparent pricing with clear inclusions/exclusions

## Risk Mitigation

ALWAYS include:
- "What YOU Control" vs "What CLIENT Controls" breakdown
- Why systems fail: poor messaging, weak offer, low volume, no optimization
- Outcome language: "Based on similar engagements, clients typically see..." NOT "We guarantee X results"

Generate ONLY the proposal document with these sections:
- Executive Summary
- Problem Assessment/Reality Check
- Solution/Strategic Approach
- Execution Plan
- Investment & Pricing (with risk mitigation)
- Why Us/Qualifications
- Next Steps`;

// Input validation constants
const MAX_TEXT_LENGTH = 15000;
const MAX_PRICING_LENGTH = 500;
const VALID_PROPOSAL_LENGTHS = ['short', 'medium', 'long', 'detailed'];

function sanitizeString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, maxLength).trim();
}

function validatePricing(pricing: unknown): { strategy: string; ai: string; managed: string } {
  const defaultPricing = { strategy: '', ai: '', managed: '' };
  if (!pricing || typeof pricing !== 'object') return defaultPricing;
  
  const p = pricing as Record<string, unknown>;
  return {
    strategy: sanitizeString(p.strategy, MAX_PRICING_LENGTH),
    ai: sanitizeString(p.ai, MAX_PRICING_LENGTH),
    managed: sanitizeString(p.managed, MAX_PRICING_LENGTH),
  };
}

function validateProposalLength(length: unknown): string {
  if (typeof length !== 'string') return 'medium';
  const normalized = length.toLowerCase();
  return VALID_PROPOSAL_LENGTHS.includes(normalized) ? normalized : 'medium';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    const clientContext = sanitizeString(body.clientContext, MAX_TEXT_LENGTH);
    const background = sanitizeString(body.background, MAX_TEXT_LENGTH);
    const caseStudies = sanitizeString(body.caseStudies, MAX_TEXT_LENGTH);
    const proposalLength = validateProposalLength(body.length);
    const pricing = validatePricing(body.pricing);
    const proposalOnly = body.proposalOnly === true;
    const stream = body.stream === true;
    const userId = typeof body.userId === 'string' ? body.userId : null;
    
    const clientIp = getClientIp(req);

    console.log('Generating proposal with Lovable AI:', { 
      proposalLength, 
      proposalOnly, 
      stream, 
      userId: userId ? 'authenticated' : 'anonymous',
      inputLengths: {
        clientContext: clientContext.length,
        background: background.length,
        caseStudies: caseStudies.length,
      }
    });

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    // Rate limiting
    if (userId) {
      const limitCheck = await checkUsageLimit(userId);
      if (!limitCheck.allowed) {
        return new Response(JSON.stringify({ error: limitCheck.message, usage_exceeded: true }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      const anonLimitCheck = await checkAnonymousRateLimit(clientIp);
      if (!anonLimitCheck.allowed) {
        return new Response(JSON.stringify({ 
          error: anonLimitCheck.message, 
          usage_exceeded: true,
          remaining: 0,
          requires_signup: true
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const systemPrompt = proposalOnly ? PROPOSAL_ONLY_PROMPT : PROPOSAL_SYSTEM_PROMPT;

    const userPrompt = proposalOnly 
      ? `Generate a ${proposalLength.toUpperCase()} proposal.

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

Generate ONLY the proposal document, formatted with proper markdown.`
      : `Generate a ${proposalLength.toUpperCase()} proposal package.

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

Generate ALL 6 deliverables with the exact section headers specified. Use --- as separator between each major section.`;

    // Streaming mode
    if (stream) {
      console.log('Starting streaming response via Claude...');
      
      if (!userId) {
        await recordAnonymousUsage(clientIp);
      }
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: proposalOnly ? 4000 : 8000,
          system: systemPrompt,
          stream: true,
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
        throw new Error(`Claude API error: ${response.status}`);
      }

      // Transform Anthropic SSE to our format
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          const text = decoder.decode(chunk);
          const lines = text.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
                continue;
              }
              
              try {
                const parsed = JSON.parse(data);
                // Handle Anthropic's streaming format
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    type: 'delta', 
                    text: parsed.delta.text 
                  })}\n\n`));
                } else if (parsed.type === 'message_stop') {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
                }
              } catch (e) {
                // Skip unparseable lines
              }
            }
          }
        },
      });

      const readableStream = response.body!.pipeThrough(transformStream);

      return new Response(readableStream, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming mode
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: proposalOnly ? 4000 : 8000,
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
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const fullText = data.content?.[0]?.text || '';
    const inputTokens = data.usage?.input_tokens || 0;
    const outputTokens = data.usage?.output_tokens || 0;

    console.log('Received AI response, length:', fullText.length, 'tokens:', inputTokens + outputTokens);

    // Track usage
    if (userId && (inputTokens > 0 || outputTokens > 0)) {
      await trackUsage(userId, inputTokens, outputTokens);
    } else if (!userId) {
      await recordAnonymousUsage(clientIp);
    }

    // Parse sections
    const extractSection = (text: string, marker: string): string => {
      const regex = new RegExp(`#\\s*${marker}\\s*\\n+([\\s\\S]*?)(?=\\n---\\s*\\n|\\n#\\s*[A-Z]|$)`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    if (proposalOnly) {
      return new Response(JSON.stringify({ 
        success: true, 
        proposal: fullText,
        deliverables: { proposal: fullText }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const deliverables = {
      proposal: extractSection(fullText, 'PROPOSAL DOCUMENT') || fullText,
      deckPrompt: extractSection(fullText, 'PRESENTATION DECK PROMPT') || extractSection(fullText, 'GENSPARK PRESENTATION PROMPT'),
      contract: extractSection(fullText, 'CONTRACT TEMPLATE'),
      contractEmail: extractSection(fullText, 'CONTRACT SUBMISSION MESSAGE'),
      invoiceDescription: extractSection(fullText, 'INVOICE DESCRIPTION'),
      proposalEmail: extractSection(fullText, 'PROPOSAL SUBMISSION EMAIL'),
    };

    console.log('Parsed deliverables:', Object.keys(deliverables).map(k => `${k}: ${deliverables[k as keyof typeof deliverables].length} chars`));

    return new Response(JSON.stringify({ success: true, deliverables }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-proposal function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
