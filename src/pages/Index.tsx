import { ProgramList } from "@/components/ProgramList";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin') {
          navigate('/admin');
          return;
        }
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="bg-accent py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-display text-accent-foreground">
          Abod Retreat
        </h1>
        <Button variant="secondary" onClick={handleLogout}>
          Kijelentkezés
        </Button>
      </header>
      <main>
        <ProgramList />
      </main>
    </div>
  );
};

export default Index;