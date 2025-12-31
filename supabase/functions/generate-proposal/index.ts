import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cost per 1K tokens (in cents) - Claude Sonnet pricing
const COST_PER_1K_INPUT_TOKENS = 0.3; // $0.003 per 1K input tokens
const COST_PER_1K_OUTPUT_TOKENS = 1.5; // $0.015 per 1K output tokens

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

  // Get start of current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Get current month usage
  const { data: usageData } = await supabase
    .from('api_usage_tracking')
    .select('total_tokens')
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  const currentUsage = (usageData || []).reduce((sum, r) => sum + (r.total_tokens || 0), 0);

  // Get user subscription
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
   - Use for: timelines, methodologies, implementation phases, client journeys

2. **GROUPED CARD LAYOUTS for Related Items**: Lists of 3-6 related concepts MUST use card layouts.
   - Format: "Display as GROUPED CARDS with icons: Card 1: [Title] - [Description] | Card 2: [Title] - [Description]"
   - Use for: services offered, team capabilities, deliverables, benefits

3. **COMPARISON VISUALIZATIONS for Options**: Any before/after or multi-option comparison MUST be visual.
   - Format: "Create COMPARISON TABLE or SIDE-BY-SIDE showing: Option A vs Option B vs Option C"
   - Use for: pricing tiers, current vs proposed state, competitive differentiation

4. **METRIC HIGHLIGHT BOXES for Numbers**: Any statistics or KPIs MUST be in highlight boxes.
   - Format: "Display as LARGE METRIC CALLOUTS: [Number] + [Label] | [Number] + [Label]"
   - Use for: ROI projections, past results, timeline durations, cost savings

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

SLIDE 10 - WHY US: GROUPED CARDS for 3-4 differentiators + METRIC CALLOUTS for credentials (years experience, clients served, etc).

SLIDE 11 - NEXT STEPS: FLOW DIAGRAM showing: Call → Proposal Review → Contract → Kickoff. Include CTA.

**DESIGN DIRECTION:**
- Specify color mood (professional blues, bold modern, warm earthy, etc.)
- Note any industry-specific imagery themes
- Request consistent iconography style

### 3. CONTRACT TEMPLATE
Professional services agreement with:
- Scope of work
- Timeline and milestones
- Payment terms
- Section 3: What Contractor Is Responsible For (checkmarks)
- Section 4: What Client Is Responsible For (checkmarks)
- Section 5: What Success Requires (acknowledging why systems fail)
- Warranty section (what IS and IS NOT guaranteed)
- Critical line: "This is a SYSTEM BUILD, not a guarantee of specific business outcomes."

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

## Pricing Scenarios Pattern

Present 2-4 scenarios:
1. Strategy & Training (lower cost, client executes)
2. Strategy + AI/Automation (higher upfront, automated systems)
3. Fully Managed (monthly fee, we do everything)
4. Partnership/Equity (when applicable)

## Risk Mitigation (CRITICAL - THIS IS THE KEY DIFFERENTIATOR)

ALWAYS include these elements:

**In the Proposal Pricing Section:**
- "What YOU Control" vs "What CLIENT Controls" breakdown
- Why systems fail: poor messaging, weak offer, low volume, no optimization
- Outcome language: "Based on similar engagements, clients typically see..." NOT "We guarantee X results"

**In the Contract:**

Section 3 - What Contractor Is Responsible For:
✓ Building the system/strategy/infrastructure
✓ Technical implementation and setup
✓ Training and documentation
✓ Strategic frameworks based on proven methodologies

Section 4 - What Client Is Responsible For:
✓ Consistent execution and volume
✓ Optimizing based on performance data
✓ Building required sales/marketing assets
✓ Testing and refining their offer
✓ Converting opportunities into revenue

Section 5 - What Success Requires:
Client acknowledges that systems fail when:
- Messaging isn't compelling
- Offer isn't attractive
- Execution volume is too low
- Approach isn't differentiated
- No optimization based on feedback

Warranty Section:
WHAT IS GUARANTEED:
✓ Functional system built to specifications
✓ Comprehensive training and documentation

WHAT IS NOT GUARANTEED:
✗ Specific business outcomes (revenue, meetings, conversions)
✗ Response rates or conversion rates
✗ Results dependent on client's offer quality or execution

Critical Legal Line: "This is a SYSTEM BUILD, not a guarantee of specific business outcomes."

**Scope Protection:**
Always include "What's NOT Included" section with change order process language.

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

## Pricing Scenarios Pattern

Present 2-4 scenarios:
1. Strategy & Training (lower cost, client executes)
2. Strategy + AI/Automation (higher upfront, automated systems)
3. Fully Managed (monthly fee, we do everything)
4. Partnership/Equity (when applicable)

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
const MAX_TEXT_LENGTH = 15000; // Max chars for text fields
const MAX_PRICING_LENGTH = 500; // Max chars for pricing tier descriptions
const VALID_PROPOSAL_LENGTHS = ['short', 'medium', 'long', 'detailed'];

// Validation helper functions
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate and sanitize all inputs
    const clientContext = sanitizeString(body.clientContext, MAX_TEXT_LENGTH);
    const background = sanitizeString(body.background, MAX_TEXT_LENGTH);
    const caseStudies = sanitizeString(body.caseStudies, MAX_TEXT_LENGTH);
    const proposalLength = validateProposalLength(body.length);
    const pricing = validatePricing(body.pricing);
    const proposalOnly = body.proposalOnly === true;
    const stream = body.stream === true;
    const userId = typeof body.userId === 'string' ? body.userId : null;

    // Log sanitized lengths (not content) to avoid log injection
    console.log('Generating proposal with Claude API:', { 
      proposalLength, 
      proposalOnly, 
      stream, 
      userId,
      inputLengths: {
        clientContext: clientContext.length,
        background: background.length,
        caseStudies: caseStudies.length,
      }
    });

    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    // Check usage limits if user is authenticated
    if (userId) {
      const limitCheck = await checkUsageLimit(userId);
      if (!limitCheck.allowed) {
        return new Response(JSON.stringify({ error: limitCheck.message, usage_exceeded: true }), {
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
      console.log('Starting streaming response...');
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: proposalOnly ? 4000 : 6000,
          stream: true,
          system: systemPrompt,
          messages: [
            { role: 'user', content: userPrompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API error:', response.status, errorText);
        throw new Error(`Claude API error: ${response.status}`);
      }

      // Create a TransformStream to process SSE events
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          const text = decoder.decode(chunk);
          const lines = text.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                
                // Handle content_block_delta events
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    type: 'delta', 
                    text: parsed.delta.text 
                  })}\n\n`));
                }
                
                // Handle message_stop event
                if (parsed.type === 'message_stop') {
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

    // Non-streaming mode (original behavior)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: proposalOnly ? 4000 : 6000,
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
        return new Response(JSON.stringify({ error: 'Invalid API key. Please check your ANTHROPIC_API_KEY.' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const fullText = data.content?.[0]?.text || '';
    const inputTokens = data.usage?.input_tokens || 0;
    const outputTokens = data.usage?.output_tokens || 0;

    console.log('Received Claude response, length:', fullText.length, 'tokens:', inputTokens + outputTokens);

    // Track usage if user is authenticated
    if (userId && (inputTokens > 0 || outputTokens > 0)) {
      await trackUsage(userId, inputTokens, outputTokens);
    }

    // Parse sections using the --- separator
    const extractSection = (text: string, marker: string): string => {
      const regex = new RegExp(`#\\s*${marker}\\s*\\n+([\\s\\S]*?)(?=\\n---\\s*\\n|\\n#\\s*[A-Z]|$)`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    // For proposalOnly mode, return just the proposal
    if (proposalOnly) {
      console.log('Proposal only mode, returning proposal:', fullText.length, 'chars');
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
