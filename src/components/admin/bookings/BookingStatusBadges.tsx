import { Badge } from "@/components/ui/badge";
import { Booking } from "../BookingsTable";

interface BookingStatusBadgesProps {
  booking: Booking;
}

export function BookingStatusBadges({ booking }: BookingStatusBadgesProps) {
  const getPaymentStatusBadge = (booking: Booking) => {
    if (!booking.payment_intent_id) {
      return null;
    }

    if (booking.status === 'confirmed') {
      return (
        <Badge variant="default" className="bg-green-600">
          Sikeresen fizetve
        </Badge>
      );
    } else if (booking.status === 'cancelled') {
      return (
        <Badge variant="secondary">
          Visszautalva
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary">
          Függőben lévő fizetés
        </Badge>
      );
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
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
      {getPaymentStatusBadge(booking)}
    </div>
  );
}