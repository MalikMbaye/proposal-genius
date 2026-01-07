import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { library_item_id, page_number, image_url } = await req.json();

    if (!library_item_id || !page_number || !image_url) {
      throw new Error("Missing required fields: library_item_id, page_number, image_url");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Authenticate user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization required");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !userData.user) {
      throw new Error("Unauthorized");
    }

    // Check if user has lifetime access (admin check could be more sophisticated)
    const { data: subscription } = await supabaseClient
      .from("user_subscriptions")
      .select("subscription_type, status")
      .eq("user_id", userData.user.id)
      .eq("status", "active")
      .eq("subscription_type", "lifetime")
      .maybeSingle();

    if (!subscription) {
      throw new Error("Lifetime access required to generate annotations");
    }

    console.log("Generating annotation for page", page_number, "of item", library_item_id);

    // Call Lovable AI with the image
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert proposal strategist analyzing winning business proposals. Your job is to provide "game film" style annotations that explain WHY each section of a proposal works.

When analyzing a proposal page, focus on:
1. **Positioning & Framing** - How the consultant positions themselves as the expert
2. **Value Communication** - How benefits and outcomes are emphasized over features
3. **Pricing Psychology** - How pricing is presented to maximize perceived value
4. **Social Proof** - Use of testimonials, case studies, or credentials
5. **Urgency & Scarcity** - Any time-sensitive elements
6. **Risk Reversal** - Guarantees or ways they reduce buyer hesitation
7. **Structure & Flow** - How information is organized for maximum impact
8. **Language Patterns** - Specific phrases or techniques that build trust

Write your annotation in a conversational, expert tone—like a coach breaking down a winning play. Be specific about what makes this page effective. If you see room for improvement, mention that too.

Keep annotations between 150-300 words. Use markdown formatting for emphasis.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this proposal page and explain what makes it effective. Break down the strategic choices and psychological techniques being used."
              },
              {
                type: "image_url",
                image_url: {
                  url: image_url
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const annotationContent = aiResponse.choices?.[0]?.message?.content;

    if (!annotationContent) {
      throw new Error("No content returned from AI");
    }

    // Use service role to insert annotation
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if annotation already exists for this page
    const { data: existing } = await supabaseAdmin
      .from("library_annotations")
      .select("id")
      .eq("library_item_id", library_item_id)
      .eq("page_number", page_number)
      .maybeSingle();

    let annotation;
    if (existing) {
      // Update existing annotation
      const { data, error } = await supabaseAdmin
        .from("library_annotations")
        .update({
          content: annotationContent,
          title: `Page ${page_number} Analysis`,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      annotation = data;
    } else {
      // Insert new annotation
      const { data, error } = await supabaseAdmin
        .from("library_annotations")
        .insert({
          library_item_id,
          page_number,
          title: `Page ${page_number} Analysis`,
          content: annotationContent,
        })
        .select()
        .single();

      if (error) throw error;
      annotation = data;
    }

    console.log("Annotation generated successfully:", annotation.id);

    return new Response(JSON.stringify({ annotation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating annotation:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
