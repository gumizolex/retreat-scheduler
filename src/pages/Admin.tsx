import { AdminDashboard } from "@/components/AdminDashboard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-accent py-4 px-4 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Sheet>
            <SheetTrigger className="lg:hidden">
              <Menu className="h-6 w-6 text-accent-foreground" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px]">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4">Admin Menü</h2>
                <Button 
                  variant="secondary" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  Kijelentkezés
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-xl sm:text-2xl font-display text-accent-foreground truncate">
            Abod Retreat Admin
          </h1>
          
          <Button 
            variant="secondary" 
            onClick={handleLogout}
            className="hidden lg:inline-flex"
          >
            Kijelentkezés
          </Button>
        </div>
      </header>
      
      <main className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <AdminDashboard />
        </div>
      </main>
    </div>
  );
};

export default Admin;