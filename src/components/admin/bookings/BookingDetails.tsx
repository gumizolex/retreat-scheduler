import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Booking } from "../BookingsTable";

interface BookingDetailsProps {
  booking: Booking;
  showProgramName?: boolean;
}

export function BookingDetails({ booking, showProgramName }: BookingDetailsProps) {
  return (
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
        {showProgramName && booking.program_title && (
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
          <p className="font-medium">Összeg</p>
          <p className="text-sm text-muted-foreground">
            {(booking.programs?.price || 0) * booking.number_of_people} RON
          </p>
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
    </div>
  );
}