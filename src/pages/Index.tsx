import { ProgramList } from "@/components/ProgramList";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <main className="min-h-screen">
      <ProgramList />
    </main>
  );
};

export default Index;