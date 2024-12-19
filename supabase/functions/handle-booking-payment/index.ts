import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { paymentIntentId, action } = await req.json()
    
    console.log('Handling payment:', { paymentIntentId, action })

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key is not configured')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    if (action === 'capture') {
      // Capture the authorized payment
      const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)
      console.log('Payment captured:', paymentIntent.id)
      
      return new Response(
        JSON.stringify({ success: true, paymentIntent }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else if (action === 'cancel') {
      // Cancel the authorized payment
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId)
      console.log('Payment cancelled:', paymentIntent.id)
      
      return new Response(
        JSON.stringify({ success: true, paymentIntent }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Error handling payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})