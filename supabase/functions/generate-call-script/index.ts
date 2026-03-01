import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert sales coach specializing in NEPQ (Neuro-Emotional Persuasion Questions) methodology.
Your task is to generate a structured phone call script for a sales professional to use when calling a prospect.

The script should be conversational, natural, and follow this structure:

## OPENING (30 seconds)
- Pattern interrupt greeting
- Permission-based opener
- Agenda setting

## SITUATIONAL QUESTIONS (2-3 minutes)
- Questions to understand their current situation
- Reference what you already know from DM conversations

## PROBLEM AWARENESS (3-5 minutes)
- Discovery questions to uncover pain points
- Amplify the problem's impact
- Connect emotional consequences

## SOLUTION BRIDGE (2-3 minutes)
- Transition to how you can help
- Reference relevant case studies or proof points
- Plant seeds of possibility

## OBJECTION HANDLING
- Anticipate likely objections based on their context
- Provide response frameworks

## CLOSE (1-2 minutes)
- Summarize value proposition
- Clear next step proposal
- Commitment question

Format the script with clear headers, suggested dialogue in quotes, and coaching notes in [brackets].
Make it personal to the specific prospect - use their name, reference their specific goals and pain points.
Keep the tone confident but consultative, never pushy.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId, prospectName, prospectContext } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth header and verify user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch user profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_name, business_context, background, proof_points")
      .eq("id", user.id)
      .single();

    let prompt: string;
    let finalLeadName: string;

    if (leadId) {
      // Generate from lead data
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .eq("user_id", user.id)
        .single();

      if (leadError || !lead) {
        return new Response(
          JSON.stringify({ error: "Lead not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch conversation history
      const { data: snapshots } = await supabase
        .from("dm_snapshots")
        .select("analysis")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false })
        .limit(5);

      const conversationHistory = snapshots?.map(s => {
        const analysis = s.analysis as any;
        return analysis?.conversation_text || "";
      }).filter(Boolean).join("\n---\n") || "";

      finalLeadName = lead.name;

      prompt = `Generate a phone call script for this prospect:

**PROSPECT INFORMATION**
Name: ${lead.name}
Platform: ${lead.platform || "Instagram"}
Current Stage: ${lead.current_stage || "Opening"}
Qualification Score: ${lead.qualification_score || 0}/10

**CONTEXT FROM DM CONVERSATIONS**
Goals: ${lead.goals || "Not yet discussed"}
Pain Points: ${lead.pain_points?.join(", ") || "Not yet identified"}
Budget Range: ${lead.budget_range || "Not discussed"}
Timeline: ${lead.timeline || "Not specified"}

**CONVERSATION HISTORY**
${conversationHistory || "No previous conversation recorded"}

**YOUR BUSINESS CONTEXT**
Company: ${profile?.company_name || "Your Company"}
Background: ${profile?.background || "Growth consultant"}
Proof Points: ${profile?.proof_points || "Multiple successful client engagements"}

Generate a complete, ready-to-use phone call script tailored to ${lead.name}.`;

    } else if (prospectName) {
      // Generate generic script from provided context
      finalLeadName = prospectName;

      prompt = `Generate a phone call script for this prospect:

**PROSPECT INFORMATION**
Name: ${prospectName}

**CONTEXT PROVIDED**
${prospectContext || "No specific context provided - create a general discovery call script"}

**YOUR BUSINESS CONTEXT**
Company: ${profile?.company_name || "Your Company"}
Background: ${profile?.background || "Growth consultant"}
Proof Points: ${profile?.proof_points || "Multiple successful client engagements"}

Generate a complete, ready-to-use phone call script tailored to ${prospectName}. 
Since limited context is available, focus more on discovery questions to uncover their situation, problems, and needs.`;

    } else {
      return new Response(
        JSON.stringify({ error: "Either leadId or prospectName is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Anthropic Claude API
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("Claude API error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate call script" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const script = aiData.content?.[0]?.text;

    if (!script) {
      return new Response(
        JSON.stringify({ error: "No script generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Call script generated for:", finalLeadName);

    return new Response(
      JSON.stringify({ 
        script,
        leadName: finalLeadName,
        leadId: leadId || null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating call script:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
