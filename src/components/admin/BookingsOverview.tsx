import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingsTable } from "./BookingsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingsCalendar } from "./BookingsCalendar";

export function BookingsOverview() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['all-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          programs (
            id,
            program_translations (
              language,
              title
            )
          )
        `)
        .order('booking_date', { ascending: true });

      if (error) throw error;
      
      return (data || []).map((booking) => ({
        ...booking,
        program_title: booking.programs?.program_translations?.find(t => t.language === 'hu')?.title || 'Unknown Program',
        status: booking.status as 'pending' | 'confirmed' | 'cancelled',
      }));
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Foglalások</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingsTable bookings={bookings || []} showProgramName={true} />
        </CardContent>
      </Card>
      <BookingsCalendar />
    </div>
  );
}