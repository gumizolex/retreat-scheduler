import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        navigate('/');
        return;
      }

      try {
        // Verify the session with Stripe through our edge function
        const { error } = await supabase.functions.invoke('verify-checkout-session', {
          body: { sessionId }
        });

        if (error) {
          console.error('Error verifying session:', error);
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold text-foreground">Foglalás sikeres!</h1>
        <p className="text-muted-foreground">
          Köszönjük a foglalását! A részleteket elküldtük emailben.
        </p>
        <Button
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Vissza a főoldalra
        </Button>
      </div>
    </div>
  );
}