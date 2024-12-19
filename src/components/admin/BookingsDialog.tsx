import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingsTable, Booking } from "./BookingsTable";

export interface BookingsDialogProps {
  programId: number;
}

export function BookingsDialog({ programId }: BookingsDialogProps) {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', programId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('program_id', programId)
        .order('booking_date', { ascending: true });

      if (error) throw error;
      
      // Convert the raw data to match the Booking type
      return (data || []).map((booking): Booking => ({
        ...booking,
        status: booking.status as 'pending' | 'confirmed' | 'cancelled',
      }));
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <BookingsTable bookings={bookings || []} />;
}