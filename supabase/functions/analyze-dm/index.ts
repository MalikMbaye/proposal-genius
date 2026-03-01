import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const { screenshot, prospectName, conversationHistory, offerContext } = await req.json();

    if (!screenshot) {
      return new Response(JSON.stringify({ error: "Screenshot is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert NEPQ sales coach trained on Jeremy Miner's methodology.

CRITICAL INSTRUCTIONS:
1. Always apply the 5-stage NEPQ framework (Connection → Problem Awareness → Consequences → Solution Awareness → Commitment)
2. Match the prospect's communication style exactly
3. Give 3 response options: Direct, Consultative, Social Proof
4. Keep responses SHORT for DMs - under 3 sentences each
5. Use commas for natural pauses, not em-dashes
6. Write like you're texting, not writing an essay
7. Questions > Statements - always advance with a question

USER'S OFFER CONTEXT:
${offerContext || "No offer context provided."}

CONVERSATION HISTORY:
${conversationHistory || "No previous conversation history."}

Analyze this DM screenshot and provide:
1. PROSPECT ANALYSIS (qualification score 1-10, heat level hot/warm/cold, NEPQ stage)
2. KEY INSIGHTS (what's really happening, red/green flags)
3. THREE RESPONSE OPTIONS formatted as:
   ### Option A: DIRECT
   ### Option B: CONSULTATIVE
   ### Option C: SOCIAL PROOF
   Each with the exact message to copy-paste
4. RECOMMENDED ACTION (which option and why)`;

    // Strip data URI prefix if present
    const base64Data = screenshot.startsWith("data:")
      ? screenshot.split(",")[1]
      : screenshot;

    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/png",
                  data: base64Data,
                },
              },
              {
                type: "text",
                text: `Analyze this DM screenshot${prospectName ? ` with prospect "${prospectName}"` : ""}. Provide prospect analysis, qualification score 1-10, heat level, NEPQ stage diagnosis, 3 response options with copy-paste messages, and recommended action.`,
              },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("Anthropic API error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Claude API error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const analysisText = aiResult.content?.[0]?.text;

    if (!analysisText) {
      throw new Error("No response from Claude");
    }

    return new Response(
      JSON.stringify({ analysis: analysisText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-dm:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
