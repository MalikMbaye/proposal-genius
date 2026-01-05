import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const leadId = url.searchParams.get("id");

    // GET - List leads or get single lead
    if (req.method === "GET") {
      if (leadId) {
        // Get single lead with snapshots
        const { data: lead, error } = await supabase
          .from("leads")
          .select(`
            *,
            dm_snapshots (
              id,
              analysis,
              response_used,
              created_at
            )
          `)
          .eq("id", leadId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching lead:", error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (!lead) {
          return new Response(
            JSON.stringify({ error: "Lead not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ lead }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        // List all leads
        const status = url.searchParams.get("status");
        const limit = parseInt(url.searchParams.get("limit") || "50");

        let query = supabase
          .from("leads")
          .select(`
            id,
            name,
            platform,
            status,
            qualification_score,
            current_stage,
            goals,
            pain_points,
            budget_range,
            timeline,
            last_activity,
            created_at,
            proposal_id
          `)
          .order("last_activity", { ascending: false })
          .limit(limit);

        if (status) {
          query = query.eq("status", status);
        }

        const { data: leads, error } = await query;

        if (error) {
          console.error("Error fetching leads:", error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ leads: leads || [] }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // POST - Create a new lead
    if (req.method === "POST") {
      const body = await req.json();
      
      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          user_id: user.id,
          name: body.name || "Unknown",
          platform: body.platform || "instagram",
          status: body.status || "cold",
          qualification_score: body.qualification_score || 1,
          current_stage: body.current_stage || "Opening",
          goals: body.goals || null,
          pain_points: body.pain_points || null,
          budget_range: body.budget_range || null,
          timeline: body.timeline || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating lead:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Lead created:", lead.id);
      return new Response(
        JSON.stringify({ lead }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // PUT - Update a lead
    if (req.method === "PUT") {
      if (!leadId) {
        return new Response(
          JSON.stringify({ error: "Lead ID required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const body = await req.json();
      
      const { data: lead, error } = await supabase
        .from("leads")
        .update({
          name: body.name,
          platform: body.platform,
          status: body.status,
          qualification_score: body.qualification_score,
          current_stage: body.current_stage,
          goals: body.goals,
          pain_points: body.pain_points,
          budget_range: body.budget_range,
          timeline: body.timeline,
          proposal_id: body.proposal_id,
          last_activity: new Date().toISOString(),
        })
        .eq("id", leadId)
        .select()
        .single();

      if (error) {
        console.error("Error updating lead:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Lead updated:", leadId);
      return new Response(
        JSON.stringify({ lead }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // DELETE - Delete a lead
    if (req.method === "DELETE") {
      if (!leadId) {
        return new Response(
          JSON.stringify({ error: "Lead ID required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", leadId);

      if (error) {
        console.error("Error deleting lead:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Lead deleted:", leadId);
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in dm-leads:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
