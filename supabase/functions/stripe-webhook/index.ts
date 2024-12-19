import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('Missing Stripe secret key')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    // Get the signature from the headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No Stripe signature found')
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('Missing Stripe webhook secret')
    }

    // Get the raw body
    const body = await req.text()
    
    // Verify the webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err)
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Received Stripe webhook event:', event.type)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Checkout session completed:', session.id)

        // Capture the payment intent
        if (session.payment_intent) {
          console.log('Capturing payment intent:', session.payment_intent)
          await stripe.paymentIntents.capture(session.payment_intent as string)
          
          // Update booking status to confirmed
          const { error: updateError } = await supabase
            .from('bookings')
            .update({ 
              status: 'confirmed',
              payment_intent_id: session.payment_intent
            })
            .eq('guest_email', session.customer_email)
            .is('payment_intent_id', null)
            .order('created_at', { ascending: false })
            .limit(1)

          if (updateError) {
            console.error('Error updating booking:', updateError)
            throw updateError
          }

          console.log('Successfully captured payment and updated booking')
        }
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log('Payment failed:', paymentIntent.id)
        
        // Update booking status to cancelled
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ 
            status: 'cancelled',
            payment_intent_id: paymentIntent.id
          })
          .eq('payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating booking:', updateError)
          throw updateError
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})