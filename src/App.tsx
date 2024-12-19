import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Activities from "./pages/Activities";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import BookingSuccess from "./pages/BookingSuccess";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session);
        
        if (!session) {
          console.log('No session found');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log('Profile data:', profile);
        setIsAdmin(profile?.role === 'admin');
        setIsLoading(false);
      } catch (error) {
        console.error('Error in checkAdmin:', error);
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Add loading state
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Activities />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route
            path="/admin/*"
            element={
              isAdmin === null ? (
                <div>Loading...</div>
              ) : isAdmin ? (
                <Admin />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;