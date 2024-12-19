import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Booking } from "../BookingsTable";
import { BookingStatusBadges } from "./BookingStatusBadges";

interface MobileBookingListProps {
  bookings: Booking[];
  onViewDetails: (booking: Booking) => void;
}

export function MobileBookingList({ bookings, onViewDetails }: MobileBookingListProps) {
  return (
    <div className="md:hidden space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-card rounded-lg shadow-sm p-4 space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div>
                <p className="font-medium">{booking.guest_name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.booking_date), 'yyyy. MM. dd. HH:mm')}
                </p>
              </div>
              <BookingStatusBadges booking={booking} />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(booking)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}