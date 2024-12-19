import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingsTable } from "./BookingsTable";

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
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <BookingsTable bookings={bookings || []} />;
}