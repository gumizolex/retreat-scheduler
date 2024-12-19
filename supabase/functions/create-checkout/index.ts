import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const exchangeRates = {
  HUF: 83.25, // 1 RON = 83.25 HUF
  RON: 1,
  EUR: 0.20 // 1 RON = 0.20 EUR
};

const convertPrice = (priceInRON: number, toCurrency: string) => {
  const rate = exchangeRates[toCurrency as keyof typeof exchangeRates] || 1;
  if (toCurrency === 'EUR') {
    return Math.round(priceInRON * rate * 100) / 100; // Convert to EUR and round to 2 decimals
  }
  return Math.round(priceInRON * rate);
};

const getTranslatedText = (language: string) => {
  const translations = {
    hu: {
      booking: "Foglalás",
    },
    en: {
      booking: "Booking",
    },
    ro: {
      booking: "Rezervare",
    }
  };

  return translations[language as keyof typeof translations] || translations.en;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { programId, price, currency, guestName, guestEmail, language = 'hu' } = await req.json()
    
    console.log("Creating checkout session for program:", { programId, price, currency, guestName, guestEmail, language })

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

    // Get the title in the requested language, fallback to Hungarian if not found
    const requestedTitle = program.program_translations.find((t: any) => t.language === language)?.title
    const huTitle = program.program_translations.find((t: any) => t.language === 'hu')?.title
    const programTitle = requestedTitle || huTitle || `Program #${programId}`

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

    // Convert price to the selected currency
    const convertedPrice = convertPrice(price, currency);
    console.log(`Converting price from RON: ${price} to ${currency}: ${convertedPrice}`);

    // For Stripe, amount needs to be in smallest currency unit (cents for EUR/USD, fillér for HUF)
    const unitAmount = currency === 'HUF' 
      ? Math.round(convertedPrice) // HUF doesn't use decimal places
      : Math.round(convertedPrice * 100); // EUR uses cents

    const t = getTranslatedText(language);

    console.log('Creating payment session for program:', programTitle, 'Amount:', unitAmount, currency.toLowerCase())
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: guestEmail,
      payment_intent_data: {
        capture_method: 'manual',
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
              description: `${t.booking}: ${guestName}`,
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
}

serve(handler)