import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Product IDs for lookup
const PRODUCT_IDS = {
  pro_monthly: "prod_ThUXIPr5J8gFxB",
  lifetime: "prod_ThUa3NfcWYtQPp",
  extra_proposals: "prod_ThUfMRmOSMp6nx",
  pro_library: "prod_ThUg9Hwf9icoDz",
};

// DM Closer subscription product IDs (monthly and annual)
const DM_PRODUCT_IDS = {
  // Monthly
  dm_starter: "prod_TkMy6rPwq8SHFq",
  dm_growth: "prod_TkMyPJgltjMy3Y",
  dm_unlimited: "prod_TkMysm8u0ORj04",
  // Annual
  dm_starter_annual: "prod_TlftkCRhng6I0w",
  dm_growth_annual: "prod_TlfuEz5dySJX9d",
  dm_unlimited_annual: "prod_TlfuvJXS6Ekgdy",
};

// DM tier limits
const DM_TIER_LIMITS = {
  free: { analyses: 5, leads: 3 },
  starter: { analyses: 50, leads: 10 },
  growth: { analyses: 200, leads: 25 },
  unlimited: { analyses: 999999, leads: 999999 },
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No customer found");
      return new Response(JSON.stringify({
        subscribed: false,
        subscription_type: null,
        has_lifetime: false,
        has_pro_library: false,
        subscription_end: null,
        proposals_this_month: 0,
        proposals_limit: 2, // Free tier - 2 proposals
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    let hasProMonthly = false;
    let subscriptionEnd: string | null = null;

    for (const sub of subscriptions.data) {
      const productId = sub.items.data[0]?.price?.product;
      if (productId === PRODUCT_IDS.pro_monthly) {
        hasProMonthly = true;
        subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
        break;
      }
    }

    // Check for lifetime and pro_library purchases (one-time payments)
    const charges = await stripe.charges.list({
      customer: customerId,
      limit: 100,
    });

    let hasLifetime = false;
    let hasProLibrary = false;
    let extraProposalsPurchased = 0;

    // Get payment intents to check product metadata
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 100,
    });

    // Check checkout sessions for completed payments
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 100,
    });

    for (const session of sessions.data) {
      if (session.payment_status === "paid" && session.metadata) {
        const productType = session.metadata.product_type;
        if (productType === "lifetime") {
          hasLifetime = true;
        } else if (productType === "pro_library") {
          hasProLibrary = true;
        } else if (productType === "extra_proposals") {
          extraProposalsPurchased += 20; // Each pack is 20 proposals
        }
      }
    }

    // Check for DM Closer subscriptions (both monthly and annual)
    let dmTier: string | null = null;
    let dmSubscriptionEnd: string | null = null;

    for (const sub of subscriptions.data) {
      const productId = sub.items.data[0]?.price?.product;
      // Check monthly products
      if (productId === DM_PRODUCT_IDS.dm_starter || productId === DM_PRODUCT_IDS.dm_starter_annual) {
        dmTier = "starter";
        dmSubscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
      } else if (productId === DM_PRODUCT_IDS.dm_growth || productId === DM_PRODUCT_IDS.dm_growth_annual) {
        dmTier = "growth";
        dmSubscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
      } else if (productId === DM_PRODUCT_IDS.dm_unlimited || productId === DM_PRODUCT_IDS.dm_unlimited_annual) {
        dmTier = "unlimited";
        dmSubscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
      }
    }

    logStep("Subscription status", { 
      hasProMonthly, 
      hasLifetime, 
      hasProLibrary, 
      extraProposalsPurchased,
      dmTier 
    });

    // Count proposals used this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: proposalsThisMonth } = await supabaseClient
      .from("proposal_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    // Get DM usage for current period
    const { data: dmUsageData } = await supabaseClient
      .from("dm_usage")
      .select("analyses_used")
      .eq("user_id", user.id)
      .gte("period_start", startOfMonth.toISOString())
      .single();

    const dmAnalysesUsed = dmUsageData?.analyses_used || 0;

    // Calculate proposal limit
    let proposalsLimit = 2; // Free tier - 2 proposals
    if (hasLifetime) {
      proposalsLimit = 999999; // Unlimited
    } else if (hasProMonthly) {
      proposalsLimit = 999999; // Unlimited for Pro Access
    }

    // Calculate DM limits based on tier
    const tierLimits = DM_TIER_LIMITS[dmTier as keyof typeof DM_TIER_LIMITS] || DM_TIER_LIMITS.free;
    const isPitchGeniusCustomer = hasProMonthly || hasLifetime;

    return new Response(JSON.stringify({
      subscribed: hasProMonthly || hasLifetime,
      subscription_type: hasLifetime ? "lifetime" : (hasProMonthly ? "pro_monthly" : null),
      has_lifetime: hasLifetime,
      has_pro_library: hasProLibrary,
      subscription_end: subscriptionEnd,
      proposals_this_month: proposalsThisMonth || 0,
      proposals_limit: proposalsLimit,
      extra_proposals_purchased: extraProposalsPurchased,
      // DM Closer subscription info
      dm_tier: dmTier,
      dm_subscription_end: dmSubscriptionEnd,
      dm_analyses_used: dmAnalysesUsed,
      dm_analyses_limit: tierLimits.analyses,
      dm_leads_limit: tierLimits.leads,
      is_pitchgenius_customer: isPitchGeniusCustomer,
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