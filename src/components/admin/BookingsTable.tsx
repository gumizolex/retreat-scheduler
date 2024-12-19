import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

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
  const handleStatusUpdate = async (bookingId: number, newStatus: 'confirmed' | 'cancelled', booking: Booking) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      // Show toast notification instead of sending email
      if (newStatus === 'confirmed') {
        toast.success(`Foglalás elfogadva: ${booking.guest_name}`);
      } else if (newStatus === 'cancelled') {
        toast.success(`Foglalás elutasítva: ${booking.guest_name}`);
      }

    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Hiba történt a művelet során');
    }
  };

  return (
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
              {booking.status === 'pending' && (
                <div className="flex gap-2">
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
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}