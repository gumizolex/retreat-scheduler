import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentIntentId, action, refund } = await req.json();
    console.log(`Processing payment action: ${action} for intent: ${paymentIntentId}, refund: ${refund}`);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    let result;

    if (action === "capture") {
      console.log("Capturing payment intent:", paymentIntentId);
      result = await stripe.paymentIntents.capture(paymentIntentId);
    } else if (action === "cancel") {
      console.log("Canceling payment intent:", paymentIntentId);
      
      // First cancel the payment intent
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      
      // If refund is requested and the payment was already captured, create a refund
      if (refund && paymentIntent.status === "succeeded") {
        console.log("Creating refund for payment intent:", paymentIntentId);
        result = await stripe.refunds.create({
          payment_intent: paymentIntentId,
        });
      } else {
        result = paymentIntent;
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing payment action:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});