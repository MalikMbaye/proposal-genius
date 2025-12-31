import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!stripeKey) {
    logStep("ERROR", { message: "STRIPE_SECRET_KEY not configured" });
    return new Response(JSON.stringify({ error: "Configuration error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Webhook signature verified");
      } catch (err) {
        logStep("Webhook signature verification failed", { error: err instanceof Error ? err.message : String(err) });
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      // For testing without webhook secret - parse event directly
      event = JSON.parse(body);
      logStep("Processing webhook without signature verification (development mode)");
    }

    logStep("Received event", { type: event.type, id: event.id });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout.session.completed", { 
          sessionId: session.id,
          customerEmail: session.customer_email,
          metadata: session.metadata 
        });

        const customerEmail = session.customer_email || session.customer_details?.email;
        const productType = session.metadata?.product_type;

        if (!customerEmail) {
          logStep("No customer email found in session");
          break;
        }

        // Find user by email
        const { data: users, error: userError } = await supabase.auth.admin.listUsers();
        if (userError) {
          logStep("Error listing users", { error: userError.message });
          break;
        }

        const user = users.users.find(u => u.email === customerEmail);
        if (!user) {
          logStep("No user found for email", { email: customerEmail });
          break;
        }

        logStep("Found user", { userId: user.id, email: customerEmail });

        // Update or create user subscription record
        const subscriptionData: Record<string, unknown> = {
          user_id: user.id,
          stripe_customer_id: session.customer as string,
          status: "active",
          updated_at: new Date().toISOString(),
        };

        if (productType === "lifetime") {
          subscriptionData.subscription_type = "lifetime";
        } else if (productType === "pro_monthly") {
          subscriptionData.subscription_type = "pro_monthly";
          subscriptionData.stripe_subscription_id = session.subscription as string;
        } else if (productType === "extra_proposals") {
          // For extra proposals, increment the count
          const { data: existing } = await supabase
            .from("user_subscriptions")
            .select("extra_proposals_purchased")
            .eq("user_id", user.id)
            .single();

          const currentExtra = existing?.extra_proposals_purchased || 0;
          subscriptionData.extra_proposals_purchased = currentExtra + 20;
        }

        // Upsert subscription record
        const { error: upsertError } = await supabase
          .from("user_subscriptions")
          .upsert(subscriptionData, { onConflict: "user_id" });

        if (upsertError) {
          logStep("Error upserting subscription", { error: upsertError.message });
        } else {
          logStep("Subscription updated successfully", { productType });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing subscription update", { 
          subscriptionId: subscription.id,
          status: subscription.status 
        });

        // Find user by Stripe customer ID
        const { data: existingSub } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (existingSub) {
          const { error } = await supabase
            .from("user_subscriptions")
            .update({
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingSub.id);

          if (error) {
            logStep("Error updating subscription", { error: error.message });
          } else {
            logStep("Subscription status updated", { status: subscription.status });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing subscription deletion", { subscriptionId: subscription.id });

        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          logStep("Error canceling subscription", { error: error.message });
        } else {
          logStep("Subscription canceled successfully");
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment failed", { 
          invoiceId: invoice.id,
          customerId: invoice.customer 
        });

        // Update subscription status to past_due
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", invoice.customer as string);

        if (error) {
          logStep("Error updating subscription to past_due", { error: error.message });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
