import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        navigate('/');
        return;
      }

      try {
        const { error } = await supabase.functions.invoke('verify-checkout-session', {
          body: { sessionId }
        });

        if (error) {
          console.error('Error verifying session:', error);
          navigate('/');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        navigate('/');
      }
    };

    verifySession();
  }, [sessionId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">
          Köszönjük a foglalását!
        </h1>
        <p className="text-muted-foreground">
          A foglalás részleteit hamarosan elküldjük emailben.
        </p>
      </div>
    </div>
  );
};

export default BookingSuccess;