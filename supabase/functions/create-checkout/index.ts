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
    const { programId, price, currency, guestName, guestEmail } = await req.json()
    
    console.log('Creating checkout session for program:', { programId, price, currency, guestName, guestEmail })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: program, error: programError } = await supabase
      .from('programs')
      .select(`
        *,
        program_translations (
          language,
          title
        )
      `)
      .eq('id', programId)
      .single()

    if (programError || !program) {
      console.error('Error fetching program:', programError)
      throw new Error('Program not found')
    }

    const huTitle = program.program_translations.find((t: any) => t.language === 'hu')?.title
    const enTitle = program.program_translations.find((t: any) => t.language === 'en')?.title
    const programTitle = huTitle || enTitle || `Program #${programId}`

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY is not set in environment variables')
      throw new Error('Stripe secret key is not configured')
    }

    if (stripeSecretKey.startsWith('http')) {
      console.error('Invalid Stripe secret key format - appears to be a URL')
      throw new Error('Invalid Stripe secret key format')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    const unitAmount = Math.round(price * 100)

    console.log('Creating payment session for program:', programTitle)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: guestEmail,
      payment_intent_data: {
        capture_method: 'manual', // This ensures the payment is only authorized, not captured
        metadata: {
          programId: programId.toString(),
          guestName,
          guestEmail,
        },
      },
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: programTitle,
              description: `Foglalás: ${guestName}`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/booking-cancelled`,
    })

    console.log('Payment session created:', session.id)
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating payment session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})