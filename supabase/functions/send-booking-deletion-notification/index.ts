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
  amount?: number;
  language?: string;
}

const getEmailContent = (data: EmailRequest) => {
  const isHungarian = data.language === 'hu';
  
  const content = {
    subject: isHungarian 
      ? `Foglalás törlésre került - ${data.programTitle}`
      : `Booking cancelled - ${data.programTitle}`,
    greeting: isHungarian 
      ? `Kedves ${data.guestName}!`
      : `Dear ${data.guestName}!`,
    mainMessage: isHungarian
      ? "Sajnálattal értesítjük, hogy a következő foglalása törlésre került:"
      : "We regret to inform you that your following booking has been cancelled:",
    programLabel: isHungarian ? "Program" : "Program",
    dateLabel: isHungarian ? "Időpont" : "Date",
    refundMessage: data.amount 
      ? (isHungarian 
          ? `A befizetett ${data.amount.toLocaleString()} Ft összeg visszatérítésre kerül.`
          : `The paid amount of ${data.amount.toLocaleString()} HUF will be refunded.`)
      : "",
    contactMessage: isHungarian
      ? "Ha kérdése van, kérjük vegye fel velünk a kapcsolatot."
      : "If you have any questions, please don't hesitate to contact us.",
    signature: isHungarian
      ? "Üdvözlettel,\nAbod Retreat csapata"
      : "Best regards,\nAbod Retreat team"
  };

  return content;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Deletion notification function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, guestName, programTitle, bookingDate, amount, language = 'hu' }: EmailRequest = await req.json();
    console.log("Sending deletion notification email to:", to);

    // Tesztelési módban mindig erre a címre küldjük
    const testEmail = "gumizolex@gmail.com";
    
    const emailContent = getEmailContent({ to, guestName, programTitle, bookingDate, amount, language });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Abod Retreat <onboarding@resend.dev>",
        to: [testEmail],
        subject: `[TESZT] ${emailContent.subject}`,
        html: `
          <div style="background: #f9f9f9; padding: 20px; margin-bottom: 20px; border-radius: 5px;">
            <strong>⚠️ TESZT MÓD</strong><br>
            Ez egy teszt email. Az eredeti címzett: ${to}
          </div>
          <div style="font-family: sans-serif; color: #333;">
            <h2>${emailContent.subject}</h2>
            <p>${emailContent.greeting}</p>
            <p>${emailContent.mainMessage}</p>
            <ul>
              <li>${emailContent.programLabel}: ${programTitle}</li>
              <li>${emailContent.dateLabel}: ${bookingDate}</li>
            </ul>
            ${emailContent.refundMessage ? `<p>${emailContent.refundMessage}</p>` : ''}
            <p>${emailContent.contactMessage}</p>
            <p>${emailContent.signature}</p>
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