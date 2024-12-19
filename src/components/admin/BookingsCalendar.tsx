import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function BookingsCalendar() {
  const { data: bookings } = useQuery({
    queryKey: ['bookings-calendar'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          programs (
            program_translations (
              language,
              title
            )
          )
        `)
        .eq('status', 'confirmed')
        .order('booking_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const bookingDates = bookings?.reduce((acc: Record<string, any[]>, booking) => {
    const date = format(new Date(booking.booking_date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(booking);
    return acc;
  }, {}) || {};

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Közelgő foglalások</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <Calendar
            mode="single"
            selected={new Date()}
            modifiers={{
              booked: (date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                return !!bookingDates[dateStr];
              },
            }}
            modifiersStyles={{
              booked: {
                backgroundColor: 'rgb(34 197 94 / 0.1)',
                color: 'rgb(34 197 94)',
                fontWeight: 'bold',
              },
            }}
            className="rounded-md border shadow"
          />
          <div className="space-y-4">
            <h3 className="font-medium">Mai foglalások:</h3>
            <div className="space-y-2">
              {bookingDates[format(new Date(), 'yyyy-MM-dd')]?.map((booking: any) => (
                <div
                  key={booking.id}
                  className="p-3 border rounded-md bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.guest_name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(booking.booking_date), 'HH:mm')} - {booking.programs.program_translations.find((t: any) => t.language === 'hu')?.title}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {booking.number_of_people} fő
                    </Badge>
                  </div>
                </div>
              ))}
              {!bookingDates[format(new Date(), 'yyyy-MM-dd')] && (
                <p className="text-sm text-gray-500">Nincs mai foglalás</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}