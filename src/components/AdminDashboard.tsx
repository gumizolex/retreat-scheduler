import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Users, Activity } from "lucide-react";
import { ProgramManagement } from "./admin/ProgramManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingsOverview } from "./admin/BookingsOverview";

export function AdminDashboard() {
  const { data: bookings, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      console.log('Fetching bookings...');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      
      console.log('Fetched bookings:', data);
      return data || [];
    },
  });

  if (isError) {
    console.error('Error in bookings query');
  }

  const totalBookings = bookings?.length || 0;
  const acceptedBookings = bookings?.filter(b => b.status === 'confirmed')?.length || 0;
  const rejectedBookings = bookings?.filter(b => b.status === 'cancelled')?.length || 0;
  const utilizationRate = totalBookings > 0 ? Math.round((acceptedBookings / totalBookings) * 100) : 0;
  
  const monthlyRevenue = bookings
    ?.filter(b => {
      const bookingDate = new Date(b.created_at);
      const currentDate = new Date();
      return bookingDate.getMonth() === currentDate.getMonth() &&
             bookingDate.getFullYear() === currentDate.getFullYear();
    })
    ?.reduce((acc, booking) => acc + 15000, 0) || 0;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Admin Vezérlőpult</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Összes foglalás
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Elfogadott foglalások
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Elutasított foglalások
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Havi bevétel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyRevenue.toLocaleString()} RON</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <BookingsOverview />
        <ProgramManagement />
      </div>
    </div>
  );
}