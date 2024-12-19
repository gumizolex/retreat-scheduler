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

  const handleStatusUpdate = async (newStatus: 'confirmed' | 'cancelled') => {
    try {
      console.log(`Updating booking status to ${newStatus}`);
      await onStatusUpdate(booking.id, newStatus, booking);
      
      // Show a message about manual Stripe handling if there's a payment
      if (booking.payment_intent_id) {
        toast.info(
          `Ne felejtsd el ${newStatus === 'confirmed' ? 'elfogadni' : 'visszautalni'} a fizetést a Stripe-ban is! Payment ID: ${booking.payment_intent_id}`,
          { duration: 10000 }
        );
      }
    } catch (error) {
      console.error(`Error updating booking status:`, error);
      toast.error(`Hiba történt a foglalás ${newStatus === 'confirmed' ? 'elfogadása' : 'elutasítása'} során`);
    }
  };

  const handleDelete = async () => {
    try {
      console.log('Deleting booking:', booking.id);
      
      // Only send deletion email if the booking wasn't already cancelled
      if (booking.status !== 'cancelled') {
        const programTitle = booking.programs?.program_translations.find(t => t.language === "hu")?.title || '';
        const formattedDate = new Date(booking.booking_date).toLocaleDateString('hu-HU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        // Calculate the total amount if the booking was confirmed
        const amount = booking.status === 'confirmed' && booking.programs?.price 
          ? booking.programs.price * booking.number_of_people 
          : undefined;

        const emailResponse = await supabase.functions.invoke('send-booking-deletion-notification', {
          body: {
            to: booking.guest_email,
            guestName: booking.guest_name,
            programTitle: programTitle,
            bookingDate: formattedDate,
            amount: amount,
            // Use the language of the first translation as the guest's preferred language
            language: booking.programs?.program_translations[0]?.language || 'hu'
          },
        });

        if (emailResponse.error) {
          console.error('Error sending deletion notification:', emailResponse.error);
          toast.error('Hiba történt az értesítő email küldése során');
          return;
        }
      }

      // Delete the booking
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

      // Show reminder about Stripe if there's a payment
      if (booking.payment_intent_id) {
        toast.info(
          `Ne felejtsd el kezelni a fizetést a Stripe-ban is! Payment ID: ${booking.payment_intent_id}`,
          { duration: 10000 }
        );
      }
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
            onClick={() => handleStatusUpdate('confirmed')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleStatusUpdate('cancelled')}
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