import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentIntentId, action } = await req.json();
    console.log(`Processing payment action: ${action} for intent: ${paymentIntentId}`);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    let result;

    if (action === "capture") {
      console.log("Capturing payment intent:", paymentIntentId);
      // Capture the authorized payment
      result = await stripe.paymentIntents.capture(paymentIntentId);
      console.log("Payment captured successfully");
    } else if (action === "cancel") {
      console.log("Canceling payment intent:", paymentIntentId);
      
      // Get the payment intent to check its status
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'requires_capture') {
        // If payment is only authorized, just cancel it
        result = await stripe.paymentIntents.cancel(paymentIntentId);
        console.log("Payment intent cancelled successfully");
      } else if (paymentIntent.status === 'succeeded') {
        // If payment was already captured, create a refund
        result = await stripe.refunds.create({
          payment_intent: paymentIntentId,
        });
        console.log("Payment refunded successfully");
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