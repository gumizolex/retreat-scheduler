import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BookingDetails } from "./bookings/BookingDetails";
import { DesktopBookingTable } from "./bookings/DesktopBookingTable";
import { MobileBookingList } from "./bookings/MobileBookingList";
import { format } from "date-fns";
import { BookingActions } from "./bookings/BookingActions";

export interface Booking {
  id: number;
  guest_name: string;
  guest_email: string;
  guest_phone?: string | null;
  booking_date: string;
  number_of_people: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  program_title?: string;
  payment_intent_id?: string | null;
  programs?: {
    price: number;
    program_translations: Array<{
      language: string;
      title: string;
    }>;
  };
}

interface BookingsTableProps {
  bookings: Booking[];
  showProgramName?: boolean;
}

export function BookingsTable({ bookings, showProgramName = false }: BookingsTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const queryClient = useQueryClient();

  const handleStatusUpdate = async (bookingId: number, newStatus: 'confirmed' | 'cancelled', booking: Booking) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      const { error: emailError } = await supabase.functions.invoke('send-booking-notification', {
        body: {
          to: [booking.guest_email],
          subject: newStatus === 'confirmed' 
            ? 'Foglalás visszaigazolva - Abod Retreat'
            : 'Foglalás elutasítva - Abod Retreat',
          html: `
            <h1>Kedves ${booking.guest_name}!</h1>
            <p>${newStatus === 'confirmed' 
              ? 'Örömmel értesítjük, hogy foglalását visszaigazoltuk.'
              : 'Sajnálattal értesítjük, hogy foglalását nem tudjuk visszaigazolni.'}</p>
            <p>Foglalás részletei:</p>
            <ul>
              <li>Időpont: ${format(new Date(booking.booking_date), 'yyyy. MM. dd. HH:mm')}</li>
              <li>Létszám: ${booking.number_of_people} fő</li>
              ${showProgramName && booking.program_title ? `<li>Program: ${booking.program_title}</li>` : ''}
            </ul>
            ${newStatus === 'confirmed' 
              ? '<p>Várjuk szeretettel!</p>'
              : '<p>Elnézést kérünk az esetleges kellemetlenségért.</p>'}
            <p>Üdvözlettel,<br>Abod Retreat csapata</p>
          `,
        },
      });

      if (emailError) {
        console.error('Hiba történt az email küldése közben:', emailError);
        toast.error('Hiba történt az email küldése közben');
      }

      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
      toast.success(`Foglalás ${newStatus === 'confirmed' ? 'elfogadva' : 'elutasítva'}: ${booking.guest_name}`);

    } catch (error) {
      console.error('Hiba történt a foglalás frissítése közben:', error);
      toast.error('Hiba történt a művelet során');
    }
  };

  return (
    <>
      <DesktopBookingTable 
        bookings={bookings}
        showProgramName={showProgramName}
        onStatusUpdate={handleStatusUpdate}
      />

      <MobileBookingList 
        bookings={bookings}
        onViewDetails={setSelectedBooking}
        onStatusUpdate={handleStatusUpdate}
      />

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="w-[90%] max-w-lg mx-auto rounded-xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Foglalás részletei</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <BookingDetails booking={selectedBooking} showProgramName={showProgramName} />
              <div className="flex justify-end">
                <BookingActions 
                  booking={selectedBooking}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}