import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Activities from "./pages/Activities";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import BookingSuccess from "./pages/BookingSuccess";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        console.log('Checking admin status...');
        const currentSession = await supabase.auth.getSession();
        if (currentSession.error) {
          console.error('Session error:', currentSession.error);
          await supabase.auth.signOut();
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        if (!currentSession.data.session) {
          console.log('No session found');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.data.session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log('Profile role:', profile?.role);
        setIsAdmin(profile?.role === 'admin');
        setIsLoading(false);
      } catch (error) {
        console.error('Error in checkAdmin:', error);
        await supabase.auth.signOut();
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    // Initial check
    checkAdmin();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsAdmin(false);
        queryClient.clear();
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('User signed in or token refreshed');
        if (session) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

            if (profileError) throw profileError;
            setIsAdmin(profile?.role === 'admin');
          } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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