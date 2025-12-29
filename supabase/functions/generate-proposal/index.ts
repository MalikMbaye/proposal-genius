import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

### 2. GENSPARK PRESENTATION PROMPT
Complete prompt for GenSpark AI Slides with slide-by-slide content (Title, Problem, Why This Matters, Our Approach, Solution Details x3, Timeline, Investment Options, Why Us, Next Steps). Include design direction.

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

## Risk Mitigation (CRITICAL)

ALWAYS include in pricing section:
- What YOU control vs what CLIENT controls
- Why systems fail (poor messaging, weak offer, low volume, no optimization)
- Outcome language: "Based on similar engagements, clients typically see..." NOT "We guarantee..."
- Scope protection: clear "What's NOT included" section

## Output Format

Structure output with these exact headers (use --- as separator between sections):
# PROPOSAL DOCUMENT
[full proposal content]

---

# GENSPARK PRESENTATION PROMPT
[complete prompt]

---

# CONTRACT TEMPLATE
[full contract]

---

# CONTRACT SUBMISSION MESSAGE
[email content]

---

# INVOICE DESCRIPTION
[invoice text]

---

# PROPOSAL SUBMISSION EMAIL
[email content]`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientContext, background, caseStudies, length, pricing } = await req.json();

    console.log('Generating proposal with params:', { length, caseStudiesCount: caseStudies?.length });

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const userPrompt = `Generate a ${length.toUpperCase()} proposal package.

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

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: PROPOSAL_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Usage limit reached. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const fullText = data.choices?.[0]?.message?.content || '';

    console.log('Received response, length:', fullText.length);

    // Parse sections using the --- separator
    const extractSection = (text: string, marker: string): string => {
      const regex = new RegExp(`#\\s*${marker}\\s*\\n+([\\s\\S]*?)(?=\\n---\\s*\\n|\\n#\\s*[A-Z]|$)`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    const deliverables = {
      proposal: extractSection(fullText, 'PROPOSAL DOCUMENT') || fullText,
      deckPrompt: extractSection(fullText, 'GENSPARK PRESENTATION PROMPT'),
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
