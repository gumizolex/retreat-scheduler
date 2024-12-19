import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";
import { Booking } from "../BookingsTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface BookingActionsProps {
  booking: Booking;
  onStatusUpdate: (bookingId: number, newStatus: 'confirmed' | 'cancelled', booking: Booking) => Promise<void>;
}

export function BookingActions({ booking, onStatusUpdate }: BookingActionsProps) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id);

      if (error) throw error;

      // Invalidate both queries to ensure all views are updated
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
      
      toast.success('Foglalás sikeresen törölve');
    } catch (error) {
      console.error('Hiba történt a foglalás törlése közben:', error);
      toast.error('Hiba történt a törlés során');
    }
  };

  return (
    <div className="flex gap-2">
      {booking.status === 'pending' && (
        <>
          <Button
            size="sm"
            onClick={() => onStatusUpdate(booking.id, 'confirmed', booking)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onStatusUpdate(booking.id, 'cancelled', booking)}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="destructive"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}