import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get the active launch promo
    const { data: promo, error: promoError } = await supabaseAdmin
      .from("launch_promo_config")
      .select("*")
      .eq("is_active", true)
      .eq("promo_code", "LAUNCH_50")
      .single();

    if (promoError || !promo) {
      console.log("No active launch promo found:", promoError);
      return new Response(
        JSON.stringify({
          promo_available: false,
          spots_remaining: 0,
          total_spots: 0,
          discount_percent: 0,
          promo_price: "$197",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const spotsRemaining = promo.total_spots - promo.spots_claimed;
    const promoAvailable = spotsRemaining > 0 && promo.is_active;
    
    // Check if promo has ended by date
    const now = new Date();
    const endsAt = promo.ends_at ? new Date(promo.ends_at) : null;
    const notExpired = !endsAt || now < endsAt;

    console.log(`Launch promo status: ${spotsRemaining} spots remaining, available: ${promoAvailable && notExpired}`);

    return new Response(
      JSON.stringify({
        promo_available: promoAvailable && notExpired,
        spots_remaining: spotsRemaining,
        total_spots: promo.total_spots,
        discount_percent: promo.discount_percent,
        promo_price: `$${(promo.promo_price_cents / 100).toFixed(0)}`,
        promo_code: promo.promo_code,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error checking launch promo:", errorMessage);
    return new Response(
      JSON.stringify({
        promo_available: false,
        spots_remaining: 0,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
