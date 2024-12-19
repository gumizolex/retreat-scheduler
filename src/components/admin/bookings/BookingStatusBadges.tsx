import { Badge } from "@/components/ui/badge";
import { Booking } from "../BookingsTable";

interface BookingStatusBadgesProps {
  booking: Booking;
}

export function BookingStatusBadges({ booking }: BookingStatusBadgesProps) {
  const getPaymentStatusBadge = (booking: Booking) => {
    if (!booking.payment_intent_id) {
      return (
        <Badge variant="secondary">
          Nincs fizetési információ
        </Badge>
      );
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
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium mb-1">Foglalás státusza</p>
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
      
      <div>
        <p className="text-sm font-medium mb-1">Fizetés státusza</p>
        {getPaymentStatusBadge(booking)}
      </div>
    </div>
  );
}