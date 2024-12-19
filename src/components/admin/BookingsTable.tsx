import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export interface Booking {
  id: number;
  guest_name: string;
  guest_email: string;
  booking_date: string;
  number_of_people: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  program_title?: string;
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

  const handleDelete = async (bookingId: number) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      // Invalidate both queries to ensure all views are updated
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
      
      toast.success('Foglalás sikeresen törölve');
      
      // Close the dialog if the deleted booking was being viewed
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Hiba történt a foglalás törlése közben:', error);
      toast.error('Hiba történt a törlés során');
    }
  };

  const BookingDetails = ({ booking }: { booking: Booking }) => (
    <div className="space-y-4">
      <div className="grid gap-2">
        <div>
          <p className="font-medium">Vendég neve</p>
          <p className="text-sm text-muted-foreground">{booking.guest_name}</p>
        </div>
        <div>
          <p className="font-medium">Email</p>
          <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
        </div>
        {showProgramName && (
          <div>
            <p className="font-medium">Program</p>
            <p className="text-sm text-muted-foreground">{booking.program_title}</p>
          </div>
        )}
        <div>
          <p className="font-medium">Időpont</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(booking.booking_date), 'yyyy. MM. dd. HH:mm')}
          </p>
        </div>
        <div>
          <p className="font-medium">Létszám</p>
          <p className="text-sm text-muted-foreground">{booking.number_of_people} fő</p>
        </div>
        <div>
          <p className="font-medium">Státusz</p>
          <Badge
            variant={
              booking.status === 'confirmed'
                ? 'default'
                : booking.status === 'cancelled'
                ? 'destructive'
                : 'secondary'
            }
          >
            {booking.status === 'confirmed'
              ? 'Elfogadva'
              : booking.status === 'cancelled'
              ? 'Elutasítva'
              : 'Függőben'}
          </Badge>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {booking.status === 'pending' && (
          <>
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(booking.id, 'confirmed', booking)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusUpdate(booking.id, 'cancelled', booking)}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(booking.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendég neve</TableHead>
              <TableHead>Email</TableHead>
              {showProgramName && <TableHead>Program</TableHead>}
              <TableHead>Időpont</TableHead>
              <TableHead>Létszám</TableHead>
              <TableHead>Státusz</TableHead>
              <TableHead>Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.guest_name}</TableCell>
                <TableCell>{booking.guest_email}</TableCell>
                {showProgramName && <TableCell>{booking.program_title}</TableCell>}
                <TableCell>
                  {format(new Date(booking.booking_date), 'yyyy. MM. dd. HH:mm')}
                </TableCell>
                <TableCell>{booking.number_of_people}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.status === 'confirmed'
                        ? 'default'
                        : booking.status === 'cancelled'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {booking.status === 'confirmed'
                      ? 'Elfogadva'
                      : booking.status === 'cancelled'
                      ? 'Elutasítva'
                      : 'Függőben'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed', booking)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled', booking)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-card rounded-lg shadow-sm p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{booking.guest_name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.booking_date), 'yyyy. MM. dd. HH:mm')}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedBooking(booking)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Foglalás részletei</DialogTitle>
          </DialogHeader>
          {selectedBooking && <BookingDetails booking={selectedBooking} />}
        </DialogContent>
      </Dialog>
    </>
  );
}