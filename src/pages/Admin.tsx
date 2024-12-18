import { AdminDashboard } from "@/components/AdminDashboard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-accent py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-display text-accent-foreground">
            Abod Retreat Admin
          </h1>
        </div>
      </header>
      <main>
        <AdminDashboard />
      </main>
    </div>
  );
};

export default Admin;