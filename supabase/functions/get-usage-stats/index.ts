import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Monthly token limits by subscription type
const TOKEN_LIMITS = {
  free: 50000, // 50K tokens/month for free tier
  pro_monthly: 1000000, // 1M tokens/month
  lifetime: 2000000, // 2M tokens/month
};

// Cost per 1K tokens (in cents) - Claude Sonnet pricing
const COST_PER_1K_INPUT_TOKENS = 0.3; // $0.003 per 1K input tokens
const COST_PER_1K_OUTPUT_TOKENS = 1.5; // $0.015 per 1K output tokens

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GET-USAGE-STATS] ${step}${detailsStr}`);
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
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id });

    // Get start of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get usage stats for current month
    const { data: usageData, error: usageError } = await supabase
      .from("api_usage_tracking")
      .select("input_tokens, output_tokens, total_tokens, estimated_cost_cents, function_name")
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    if (usageError) {
      throw new Error(`Error fetching usage: ${usageError.message}`);
    }

    // Calculate totals
    const totals = {
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0,
      estimated_cost_cents: 0,
    };

    const byFunction: Record<string, { count: number; tokens: number }> = {};

    for (const record of usageData || []) {
      totals.input_tokens += record.input_tokens || 0;
      totals.output_tokens += record.output_tokens || 0;
      totals.total_tokens += record.total_tokens || 0;
      totals.estimated_cost_cents += record.estimated_cost_cents || 0;

      if (!byFunction[record.function_name]) {
        byFunction[record.function_name] = { count: 0, tokens: 0 };
      }
      byFunction[record.function_name].count++;
      byFunction[record.function_name].tokens += record.total_tokens || 0;
    }

    // Get user's subscription type
    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("subscription_type, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    const subscriptionType = subscription?.subscription_type || "free";
    const tokenLimit = TOKEN_LIMITS[subscriptionType as keyof typeof TOKEN_LIMITS] || TOKEN_LIMITS.free;
    const tokensRemaining = Math.max(0, tokenLimit - totals.total_tokens);
    const usagePercentage = Math.round((totals.total_tokens / tokenLimit) * 100);

    logStep("Usage stats calculated", { 
      totalTokens: totals.total_tokens,
      tokenLimit,
      usagePercentage,
      subscriptionType 
    });

    return new Response(JSON.stringify({
      current_month: {
        input_tokens: totals.input_tokens,
        output_tokens: totals.output_tokens,
        total_tokens: totals.total_tokens,
        estimated_cost_dollars: (totals.estimated_cost_cents / 100).toFixed(2),
      },
      limits: {
        token_limit: tokenLimit,
        tokens_remaining: tokensRemaining,
        usage_percentage: usagePercentage,
        subscription_type: subscriptionType,
      },
      breakdown_by_function: byFunction,
      is_over_limit: totals.total_tokens >= tokenLimit,
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
