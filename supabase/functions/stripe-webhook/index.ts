import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// DM Closer product IDs (both monthly and annual)
const DM_PRODUCT_IDS: Record<string, string> = {
  // Monthly
  "prod_TkMy6rPwq8SHFq": "starter",
  "prod_TkMyPJgltjMy3Y": "growth",
  "prod_TkMysm8u0ORj04": "unlimited",
  // Annual
  "prod_TlftkCRhng6I0w": "starter",
  "prod_TlfuEz5dySJX9d": "growth",
  "prod_TlfuvJXS6Ekgdy": "unlimited",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Helper to get DM tier from product ID
function getDMTierFromProductId(productId: string | null): string | null {
  if (!productId) return null;
  return DM_PRODUCT_IDS[productId] || null;
}

// Helper to check if a product is a DM subscription
function isDMProduct(productId: string | null): boolean {
  if (!productId) return false;
  return Object.keys(DM_PRODUCT_IDS).includes(productId);
}

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

  if (!webhookSecret) {
    logStep("ERROR", { message: "STRIPE_WEBHOOK_SECRET not configured" });
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

    if (!signature) {
      logStep("ERROR", { message: "Missing stripe-signature header" });
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let event: Stripe.Event;

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

        // Check if this is a DM subscription
        const isDMSubscription = productType?.startsWith("dm_");
        
        // Update or create user subscription record
        const subscriptionData: Record<string, unknown> = {
          user_id: user.id,
          stripe_customer_id: session.customer as string,
          updated_at: new Date().toISOString(),
        };

        if (isDMSubscription) {
          // Handle DM subscription (extract tier from product_type like dm_starter_annual -> starter)
          const dmTier = productType?.replace("dm_", "").replace("_annual", "") || null;
          subscriptionData.dm_subscription_tier = dmTier;
          subscriptionData.dm_subscription_id = session.subscription as string;
          subscriptionData.dm_period_end = null; // Will be set by subscription.updated event
          
          // Mark as PitchGenius customer if they have an existing subscription
          const { data: existingSub } = await supabase
            .from("user_subscriptions")
            .select("subscription_type")
            .eq("user_id", user.id)
            .single();
          
          if (existingSub?.subscription_type) {
            subscriptionData.pitchgenius_customer = true;
          }
          
          logStep("DM subscription checkout completed", { dmTier });
        } else if (productType === "lifetime") {
          subscriptionData.subscription_type = "lifetime";
          subscriptionData.status = "active";
          subscriptionData.pitchgenius_customer = true;
        } else if (productType === "pro_monthly" || productType === "pro_annual") {
          subscriptionData.subscription_type = productType;
          subscriptionData.stripe_subscription_id = session.subscription as string;
          subscriptionData.status = "active";
          subscriptionData.pitchgenius_customer = true;
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
        const productId = subscription.items.data[0]?.price?.product as string;
        
        logStep("Processing subscription update", { 
          subscriptionId: subscription.id,
          status: subscription.status,
          productId
        });

        // Check if this is a DM subscription
        if (isDMProduct(productId)) {
          const dmTier = getDMTierFromProductId(productId);
          logStep("DM subscription update detected", { dmTier });
          
          // Find by DM subscription ID
          const { data: existingSub } = await supabase
            .from("user_subscriptions")
            .select("*")
            .eq("dm_subscription_id", subscription.id)
            .single();

          if (existingSub) {
            const updateData: Record<string, unknown> = {
              dm_subscription_tier: subscription.status === "active" ? dmTier : null,
              dm_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            };
            
            // If subscription is canceled or past_due, clear the tier
            if (subscription.status !== "active") {
              updateData.dm_subscription_tier = null;
            }

            const { error } = await supabase
              .from("user_subscriptions")
              .update(updateData)
              .eq("id", existingSub.id);

            if (error) {
              logStep("Error updating DM subscription", { error: error.message });
            } else {
              logStep("DM subscription updated", { dmTier, status: subscription.status });
            }
          } else {
            // Try to find by stripe_customer_id
            const customerId = subscription.customer as string;
            const { data: subByCustomer } = await supabase
              .from("user_subscriptions")
              .select("*")
              .eq("stripe_customer_id", customerId)
              .single();
              
            if (subByCustomer) {
              const { error } = await supabase
                .from("user_subscriptions")
                .update({
                  dm_subscription_id: subscription.id,
                  dm_subscription_tier: subscription.status === "active" ? dmTier : null,
                  dm_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                  updated_at: new Date().toISOString(),
                })
                .eq("id", subByCustomer.id);
                
              if (error) {
                logStep("Error updating DM subscription by customer", { error: error.message });
              } else {
                logStep("DM subscription linked and updated", { dmTier });
              }
            }
          }
        } else {
          // Regular PitchGenius subscription update
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
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const productId = subscription.items.data[0]?.price?.product as string;
        
        logStep("Processing subscription deletion", { 
          subscriptionId: subscription.id,
          productId 
        });

        // Check if this is a DM subscription
        if (isDMProduct(productId)) {
          const { error } = await supabase
            .from("user_subscriptions")
            .update({
              dm_subscription_tier: null,
              dm_subscription_id: null,
              dm_period_end: null,
              updated_at: new Date().toISOString(),
            })
            .eq("dm_subscription_id", subscription.id);

          if (error) {
            logStep("Error canceling DM subscription", { error: error.message });
          } else {
            logStep("DM subscription canceled successfully");
          }
        } else {
          // Regular subscription deletion
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
