import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, EyeOff } from "lucide-react";
import { Booking } from "../BookingsTable";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface MobileBookingListProps {
  bookings: Booking[];
  onViewDetails: (booking: Booking) => void;
}

export function MobileBookingList({ bookings, onViewDetails }: MobileBookingListProps) {
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);

  const toggleBookingDetails = (bookingId: number) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  return (
    <div className="md:hidden space-y-4">
      {bookings.map((booking) => {
        const programTranslations = booking.programs?.program_translations || [];
        const programTitle = programTranslations.find(
          (t: any) => t.language === 'hu'
        )?.title || programTranslations[0]?.title || 'Program nem található';

        const isExpanded = expandedBooking === booking.id;

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
                        {format(new Date(booking.booking_date), 'yyyy. MM. dd. HH:mm')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleBookingDetails(booking.id)}
                    >
                      {isExpanded ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <>
                    <div className="space-y-2 pt-2 border-t">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
                      </div>
                      
                      {booking.guest_phone && (
                        <div>
                          <p className="text-sm font-medium">Telefonszám</p>
                          <p className="text-sm text-muted-foreground">{booking.guest_phone}</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm font-medium">Program</p>
                        <p className="text-sm text-muted-foreground">{programTitle}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Létszám</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.number_of_people} fő
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Összeg</p>
                        <p className="text-sm text-muted-foreground">
                          {(booking.programs?.price || 0) * booking.number_of_people} RON
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium mb-1">Státusz</p>
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
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}