import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// System prompt for DM analysis
const SYSTEM_PROMPT = `You are a 7-figure sales AI assistant analyzing Instagram DM screenshots.

TASK:
Analyze this DM screenshot and return a JSON response with sales coaching.

EXTRACTION:
1. Find the prospect's name in the Instagram conversation header (usually at the top)
2. Extract all visible message text from the conversation
3. Identify the platform (Instagram, LinkedIn, etc.)

ANALYSIS FRAMEWORK (7-Figure Sales Method):
- Stage 1 (Opening): Building initial rapport and connection
- Stage 2 (Qualifying): Understanding their situation and needs
- Stage 3 (Building Urgency): Helping them feel the cost of inaction
- Stage 4 (Pitching): Introducing your solution naturally
- Stage 5 (Booking): Getting commitment to next step

RESPONSE RULES:
- Match their energy exactly (casual if casual, professional if professional)
- Keep messages under 3 sentences (DM appropriate length)
- Never be salesy or pushy - be genuinely curious
- Questions > Statements
- Advance the conversation naturally toward booking

Return ONLY valid JSON (no markdown, no explanation):
{
  "prospect_name": "Name from screenshot header",
  "platform": "instagram",
  "conversation_text": "The actual conversation text visible",
  "qualification_score": 7,
  "heat_level": "cold|warm|hot|qualified",
  "current_stage": "Opening|Qualifying|Building Urgency|Pitching|Booking",
  "response_options": {
    "A": {
      "type": "Direct",
      "message": "Exact message to copy-paste, matching their tone"
    },
    "B": {
      "type": "Consultative",
      "message": "Exact message to copy-paste, matching their tone"
    },
    "C": {
      "type": "Social Proof",
      "message": "Exact message to copy-paste, matching their tone"
    }
  },
  "recommended": "A|B|C",
  "reasoning": "One sentence on why this option is best",
  "extracted_context": {
    "goals": "What they want to achieve (null if not mentioned)",
    "pain_points": ["Pain point 1", "Pain point 2"],
    "budget_signals": "Any budget mentions (null if none)",
    "timeline_signals": "Any urgency/timeline mentions (null if none)"
  },
  "next_action": "What to watch for or do after they respond"
}`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { screenshot, leadId } = await req.json();

    if (!screenshot) {
      throw new Error("Screenshot is required");
    }

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is required");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      throw new Error("Unauthorized");
    }

    console.log("User authenticated:", user.id);

    // Check and update DM usage limits
    const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get current period dates
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    
    // Get or create usage record for this period
    const { data: usageRecord } = await serviceClient
      .from("dm_usage")
      .select("*")
      .eq("user_id", user.id)
      .gte("period_start", periodStart)
      .lte("period_end", periodEnd)
      .maybeSingle();
    
    // Get user's subscription tier to determine limit
    const { data: subscription } = await serviceClient
      .from("user_subscriptions")
      .select("dm_subscription_tier")
      .eq("user_id", user.id)
      .maybeSingle();
    
    const dmTier = subscription?.dm_subscription_tier || null;
    
    // Determine limit based on tier
    let analysesLimit = 5; // Free tier default
    if (dmTier === 'starter') analysesLimit = 50;
    else if (dmTier === 'growth') analysesLimit = 200;
    else if (dmTier === 'unlimited') analysesLimit = 999999;
    
    const currentUsage = usageRecord?.analyses_used || 0;
    
    // Check if at limit
    if (currentUsage >= analysesLimit) {
      console.log("User at DM analysis limit:", currentUsage, "/", analysesLimit);
      return new Response(
        JSON.stringify({ 
          error: "You've reached your monthly DM analysis limit. Upgrade to continue.",
          limitReached: true 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get user's offer context from their profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("business_context, background, proof_points")
      .eq("id", user.id)
      .maybeSingle();

    const offerContext = profile
      ? `Business: ${profile.business_context || "Not specified"}\nBackground: ${profile.background || "Not specified"}\nProof points: ${profile.proof_points || "Not specified"}`
      : "No specific offer context provided. Assume they are a consultant/service provider.";

    // Get conversation history if this is an existing lead
    let conversationHistory = "";
    if (leadId) {
      const { data: snapshots } = await supabase
        .from("dm_snapshots")
        .select("analysis")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: true });

      if (snapshots && snapshots.length > 0) {
        conversationHistory = snapshots
          .map((s: { analysis: { conversation_text?: string } }, i: number) => 
            `Exchange ${i + 1}:\n${s.analysis?.conversation_text || ""}`
          )
          .join("\n\n");
      }
    }

    // Build the full system prompt with context
    const fullSystemPrompt = `${SYSTEM_PROMPT}

USER'S OFFER CONTEXT:
${offerContext}

${conversationHistory ? `PREVIOUS CONVERSATION CONTEXT:\n${conversationHistory}\n` : ""}`;

    console.log("Calling Claude API for vision analysis...");

    // Strip data URI prefix if present for Claude format
    const screenshotData = screenshot.startsWith("data:") ? screenshot : `data:image/png;base64,${screenshot}`;
    const base64Data = screenshotData.startsWith("data:") ? screenshotData.split(",")[1] : screenshotData;
    const mediaType = screenshotData.match(/data:(image\/[^;]+)/)?.[1] || "image/png";

    // Call Anthropic Claude API with vision
    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: fullSystemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              {
                type: "text",
                text: "Analyze this DM screenshot and respond with JSON only.",
              },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("Claude API error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      }
      throw new Error(`Claude API error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const content = aiResult.content?.[0]?.text;

    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI response received, parsing...");

    // Parse the JSON response
    let analysis;
    try {
      // Try direct parse first
      analysis = JSON.parse(content);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        console.error("Failed to parse AI response:", content);
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    console.log("Analysis parsed successfully:", analysis.prospect_name);

    // If no leadId, create a new lead
    let finalLeadId = leadId;
    if (!leadId) {
      const { data: newLead, error: leadError } = await supabase
        .from("leads")
        .insert({
          user_id: user.id,
          name: analysis.prospect_name || "Unknown",
          platform: analysis.platform || "instagram",
          status: analysis.heat_level || "cold",
          qualification_score: analysis.qualification_score || 1,
          current_stage: analysis.current_stage || "Opening",
          goals: analysis.extracted_context?.goals || null,
          pain_points: analysis.extracted_context?.pain_points || null,
          budget_range: analysis.extracted_context?.budget_signals || null,
          timeline: analysis.extracted_context?.timeline_signals || null,
        })
        .select()
        .single();

      if (leadError) {
        console.error("Error creating lead:", leadError);
        throw new Error(`Failed to create lead: ${leadError.message}`);
      }
      
      finalLeadId = newLead.id;
      console.log("New lead created:", finalLeadId);
    } else {
      // Update existing lead with latest analysis
      const { error: updateError } = await supabase
        .from("leads")
        .update({
          status: analysis.heat_level || undefined,
          qualification_score: analysis.qualification_score || undefined,
          current_stage: analysis.current_stage || undefined,
          goals: analysis.extracted_context?.goals || undefined,
          pain_points: analysis.extracted_context?.pain_points || undefined,
          budget_range: analysis.extracted_context?.budget_signals || undefined,
          timeline: analysis.extracted_context?.timeline_signals || undefined,
          last_activity: new Date().toISOString(),
        })
        .eq("id", leadId);

      if (updateError) {
        console.error("Error updating lead:", updateError);
      }
    }

    // Save the snapshot
    const { error: snapshotError } = await supabase.from("dm_snapshots").insert({
      lead_id: finalLeadId,
      analysis: analysis,
    });

    if (snapshotError) {
      console.error("Error saving snapshot:", snapshotError);
    }

    // Increment DM usage count
    if (usageRecord) {
      await serviceClient
        .from("dm_usage")
        .update({ 
          analyses_used: currentUsage + 1,
          updated_at: new Date().toISOString()
        })
        .eq("id", usageRecord.id);
    } else {
      await serviceClient
        .from("dm_usage")
        .insert({
          user_id: user.id,
          analyses_used: 1,
          period_start: periodStart,
          period_end: periodEnd,
        });
    }

    console.log("Snapshot saved for lead:", finalLeadId, "| Usage:", currentUsage + 1, "/", analysesLimit);

    return new Response(
      JSON.stringify({
        success: true,
        leadId: finalLeadId,
        analysis: analysis,
        isNewLead: !leadId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-screenshot:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
