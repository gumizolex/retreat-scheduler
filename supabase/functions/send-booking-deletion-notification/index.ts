import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  guestName: string;
  programTitle: string;
  bookingDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Deletion notification function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, guestName, programTitle, bookingDate }: EmailRequest = await req.json();
    console.log("Sending deletion notification email to:", to);

    // Tesztelési módban mindig erre a címre küldjük
    const testEmail = "gumizolex@gmail.com";
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Abod Retreat <onboarding@resend.dev>",
        to: [testEmail],
        subject: `[TESZT] Foglalás törlésre került - ${programTitle}`,
        html: `
          <div style="background: #f9f9f9; padding: 20px; margin-bottom: 20px; border-radius: 5px;">
            <strong>⚠️ TESZT MÓD</strong><br>
            Ez egy teszt email. Az eredeti címzett: ${to}
          </div>
          <div style="font-family: sans-serif; color: #333;">
            <h2>Foglalás törlésre került</h2>
            <p>Kedves ${guestName}!</p>
            <p>Sajnálattal értesítjük, hogy a következő foglalása törlésre került:</p>
            <ul>
              <li>Program: ${programTitle}</li>
              <li>Időpont: ${bookingDate}</li>
            </ul>
            <p>Ha kérdése van, kérjük vegye fel velünk a kapcsolatot.</p>
            <p>Üdvözlettel,<br>Abod Retreat csapata</p>
          </div>
        `,
      }),
    });

    const data = await res.json();
    console.log("Resend API response:", data);

    if (res.ok) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      console.error("Error from Resend API:", data);
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in send-booking-deletion-notification function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);