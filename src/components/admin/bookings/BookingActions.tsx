import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";
import { Booking } from "../BookingsTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookingActionsProps {
  booking: Booking;
  onStatusUpdate: (bookingId: number, newStatus: 'confirmed' | 'cancelled', booking: Booking) => Promise<void>;
}

export function BookingActions({ booking, onStatusUpdate }: BookingActionsProps) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      console.log('Deleting booking:', booking.id);
      
      // First, send the deletion notification email
      const programTitle = booking.programs?.program_translations.find(t => t.language === "hu")?.title || '';
      const formattedDate = new Date(booking.booking_date).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const emailResponse = await supabase.functions.invoke('send-booking-deletion-notification', {
        body: {
          to: booking.guest_email,
          guestName: booking.guest_name,
          programTitle: programTitle,
          bookingDate: formattedDate
        },
      });

      if (emailResponse.error) {
        console.error('Error sending deletion notification:', emailResponse.error);
        toast.error('Hiba történt az értesítő email küldése során');
        return;
      }

      // Then delete the booking
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', booking.id);

      if (error) {
        console.error('Error deleting booking:', error);
        throw error;
      }

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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Biztosan törölni szeretnéd ezt a foglalást?</AlertDialogTitle>
            <AlertDialogDescription>
              Ez a művelet nem vonható vissza. A foglalás véglegesen törlődik az adatbázisból.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mégsem</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Törlés</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}