import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Booking } from "../BookingsTable";
import { BookingActions } from "./BookingActions";
import { Badge } from "@/components/ui/badge";

interface DesktopBookingTableProps {
  bookings: Booking[];
  showProgramName?: boolean;
  onStatusUpdate: (bookingId: number, newStatus: 'confirmed' | 'cancelled', booking: Booking) => Promise<void>;
}

export function DesktopBookingTable({ bookings, showProgramName, onStatusUpdate }: DesktopBookingTableProps) {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendég neve</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefonszám</TableHead>
            {showProgramName && <TableHead>Program</TableHead>}
            <TableHead>Időpont</TableHead>
            <TableHead>Létszám</TableHead>
            <TableHead>Összeg</TableHead>
            <TableHead>Státusz</TableHead>
            <TableHead>Műveletek</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.guest_name}</TableCell>
              <TableCell>{booking.guest_email}</TableCell>
              <TableCell>{booking.guest_phone || '-'}</TableCell>
              {showProgramName && <TableCell>{booking.program_title}</TableCell>}
              <TableCell>
                {format(new Date(booking.booking_date), 'yyyy. MM. dd. HH:mm')}
              </TableCell>
              <TableCell>{booking.number_of_people}</TableCell>
              <TableCell>{(booking.programs?.price || 0) * booking.number_of_people} RON</TableCell>
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
                <BookingActions 
                  booking={booking}
                  onStatusUpdate={onStatusUpdate}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}