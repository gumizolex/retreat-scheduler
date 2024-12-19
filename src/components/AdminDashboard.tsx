import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Activity, Clock } from "lucide-react";
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
        .select(`
          *,
          programs (
            price,
            program_translations (
              title,
              language
            )
          )
        `)
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
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed')?.length || 0;
  const cancelledBookings = bookings?.filter(b => b.status === 'cancelled')?.length || 0;
  const utilizationRate = totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;
  
  const monthlyRevenue = bookings
    ?.filter(b => {
      const bookingDate = new Date(b.created_at);
      const currentDate = new Date();
      return bookingDate.getMonth() === currentDate.getMonth() &&
             bookingDate.getFullYear() === currentDate.getFullYear() &&
             b.status === 'confirmed';
    })
    ?.reduce((acc, booking) => {
      const programPrice = booking.programs?.price || 0;
      return acc + (programPrice * booking.number_of_people);
    }, 0) || 0;

  const upcomingBookings = bookings
    ?.filter(b => new Date(b.booking_date) > new Date())
    ?.sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())
    ?.slice(0, 6) || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-display font-bold">Admin Vezérlőpult</h1>
      
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Összes foglalás
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
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
            <div className="text-2xl font-bold">{confirmedBookings}</div>
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
            <div className="text-2xl font-bold">{cancelledBookings}</div>
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

      <div className="space-y-4 sm:space-y-6">
        <BookingsOverview />
        
        {upcomingBookings.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                Következő foglalások
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {upcomingBookings.map((booking) => {
                  const programTranslations = booking.programs?.program_translations || [];
                  const programTitle = programTranslations.find(
                    (t: any) => t.language === 'hu'
                  )?.title || programTranslations[0]?.title || 'Program nem található';

                  return (
                    <div
                      key={booking.id}
                      className="bg-secondary/50 rounded-lg p-2.5 hover:bg-secondary/70 transition-colors"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="font-medium text-xs truncate">
                          {booking.guest_name}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {programTitle}
                        </div>
                        <div className="text-[11px] text-primary font-medium mt-0.5">
                          {new Date(booking.booking_date).toLocaleDateString('hu-HU', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {booking.number_of_people} fő
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        
        <ProgramManagement />
      </div>
    </div>
  );
}