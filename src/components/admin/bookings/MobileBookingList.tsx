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
      {bookings.map((booking) => {
        const programTranslations = booking.programs?.program_translations || [];
        const programTitle = programTranslations.find(
          (t: any) => t.language === 'hu'
        )?.title || programTranslations[0]?.title || 'Program nem található';

        return (
          <div
            key={booking.id}
            className="bg-card rounded-lg shadow-sm p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-3 w-full">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{booking.guest_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.guest_email}
                      </p>
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

                <div className="space-y-2 pt-2 border-t">
                  <div>
                    <p className="text-sm font-medium">Program</p>
                    <p className="text-sm text-muted-foreground">{programTitle}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Időpont</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(booking.booking_date), 'yyyy. MM. dd. HH:mm')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Létszám</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.number_of_people} fő
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <BookingStatusBadges booking={booking} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}