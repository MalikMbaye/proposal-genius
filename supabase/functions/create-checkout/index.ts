import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Stripe product/price IDs
const PRODUCTS = {
  pro_monthly: {
    price_id: "price_1Sk5YcAIOyHZaZ4io4gmqYfh",
    product_id: "prod_ThUXIPr5J8gFxB",
    mode: "subscription" as const,
  },
  lifetime: {
    price_id: "price_1Sk5bdAIOyHZaZ4ieGeRtCU6",
    product_id: "prod_ThUa3NfcWYtQPp",
    mode: "payment" as const,
  },
  extra_proposals: {
    price_id: "price_1Sk5fnAIOyHZaZ4iHrv58k0s",
    product_id: "prod_ThUfMRmOSMp6nx",
    mode: "payment" as const,
  },
  pro_library: {
    price_id: "price_1Sk5hHAIOyHZaZ4iF7CcGk1L",
    product_id: "prod_ThUg9Hwf9icoDz",
    mode: "payment" as const,
  },
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const { product_type } = await req.json();
    logStep("Received request", { product_type });

    if (!product_type || !PRODUCTS[product_type as keyof typeof PRODUCTS]) {
      throw new Error(`Invalid product type: ${product_type}`);
    }

    const product = PRODUCTS[product_type as keyof typeof PRODUCTS];
    logStep("Product selected", product);

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: product.price_id,
          quantity: 1,
        },
      ],
      mode: product.mode,
      success_url: `${origin}/dashboard?checkout=success&product=${product_type}`,
      cancel_url: `${origin}/dashboard?checkout=canceled`,
      metadata: {
        user_id: user.id,
        product_type,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
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