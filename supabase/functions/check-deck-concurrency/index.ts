import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Maximum concurrent deck generation jobs
const MAX_CONCURRENT_JOBS = 10;

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-DECK-CONCURRENCY] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Checking deck generation concurrency");

    // Count currently active jobs (pending or running)
    const { count: activeJobs, error: countError } = await supabase
      .from("deck_generation_jobs")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "running"]);

    if (countError) {
      throw new Error(`Error counting active jobs: ${countError.message}`);
    }

    const currentActive = activeJobs || 0;
    const canStartNew = currentActive < MAX_CONCURRENT_JOBS;
    const queuePosition = canStartNew ? 0 : currentActive - MAX_CONCURRENT_JOBS + 1;

    logStep("Concurrency check result", { 
      currentActive, 
      maxConcurrent: MAX_CONCURRENT_JOBS,
      canStartNew,
      queuePosition 
    });

    return new Response(JSON.stringify({
      can_start: canStartNew,
      current_active: currentActive,
      max_concurrent: MAX_CONCURRENT_JOBS,
      queue_position: queuePosition,
      estimated_wait_minutes: queuePosition * 5, // Estimate 5 min per job
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
