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
const queryClient = new QueryClient();

function App() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          // Clear any invalid tokens
          await supabase.auth.signOut();
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        if (!session) {
          console.log('No session found');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        setIsAdmin(profile?.role === 'admin');
        setIsLoading(false);
      } catch (error) {
        console.error('Error in checkAdmin:', error);
        // Clear any invalid tokens on error
        await supabase.auth.signOut();
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        queryClient.clear(); // Clear query cache on sign out
      }

      if (event === 'SIGNED_IN') {
        checkAdmin();
      }

      // Handle token refresh errors
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.error('Token refresh failed');
        toast({
          title: "Session expired",
          description: "Please sign in again",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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