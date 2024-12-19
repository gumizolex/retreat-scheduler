import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Booking } from "../BookingsTable";
import { BookingActions } from "./BookingActions";
import { BookingStatusBadges } from "./BookingStatusBadges";

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
            <TableHead>Státusz és fizetés</TableHead>
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
              <TableCell>
                <BookingStatusBadges booking={booking} />
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