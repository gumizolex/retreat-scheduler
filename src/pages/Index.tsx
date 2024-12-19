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
      <header className="bg-primary py-16 text-primary-foreground relative">
        {isLoggedIn && (
          <div className="absolute top-4 right-4">
            <Button variant="secondary" onClick={handleLogout}>
              Kijelentkezés
            </Button>
          </div>
        )}
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-8">
            <img 
              src="/286a10de-5937-4235-ae40-ff61e619ded2.png"
              alt="Abod Retreat Logo" 
              className="h-32 md:h-40 w-auto object-contain"
            />
            <h1 className="text-5xl font-display font-bold text-center">
              Abod Retreat
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-center">
              Fedezze fel egyedülálló programjainkat és élményeinket Erdély szívében
            </p>
          </div>
        </div>
      </header>
      <main>
        <ProgramList />
      </main>
    </div>
  );
};

export default Index;