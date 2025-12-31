import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LIFETIME_LIMIT = 9;
const LIFETIME_PRODUCT_ID = "prod_Thr7zNfpSc4ezH";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-LIFETIME-AVAILABILITY] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Count all completed checkout sessions for lifetime product
    let lifetimePurchases = 0;
    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const sessions = await stripe.checkout.sessions.list({
        limit: 100,
        starting_after: startingAfter,
      });

      for (const session of sessions.data) {
        if (session.payment_status === "paid" && session.metadata?.product_type === "lifetime") {
          lifetimePurchases++;
        }
      }

      hasMore = sessions.has_more;
      if (sessions.data.length > 0) {
        startingAfter = sessions.data[sessions.data.length - 1].id;
      }
    }

    const spotsRemaining = Math.max(0, LIFETIME_LIMIT - lifetimePurchases);
    const isAvailable = spotsRemaining > 0;

    logStep("Lifetime availability checked", { 
      lifetimePurchases, 
      spotsRemaining, 
      isAvailable 
    });

    return new Response(JSON.stringify({
      available: isAvailable,
      spots_remaining: spotsRemaining,
      total_limit: LIFETIME_LIMIT,
      total_sold: lifetimePurchases,
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