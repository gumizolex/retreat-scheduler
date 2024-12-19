import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ProgramList } from "@/components/ProgramList";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Sikeres kijelentkezés",
        description: "Viszontlátásra!",
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hiba történt",
        description: error.message || "Sikertelen kijelentkezés",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {isLoggedIn && (
        <div className="absolute top-4 right-4">
          <Button variant="secondary" onClick={handleLogout}>
            Kijelentkezés
          </Button>
        </div>
      )}
      <main>
        <ProgramList />
      </main>
    </div>
  );
};

export default Index;