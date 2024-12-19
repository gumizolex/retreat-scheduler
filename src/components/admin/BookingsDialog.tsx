import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Phone, Mail, Users, MapPin } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookingStatus } from "./BookingsTable";

interface BookingsDialogProps {
  onClose: () => void;
}

export function BookingsDialog({ onClose }: BookingsDialogProps) {
  const queryClient = useQueryClient();

  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(booking => ({
        ...booking,
        status: booking.status as BookingStatus
      }));
    },
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: BookingStatus }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Foglalás státusza frissítve');
    },
    onError: (error) => {
      toast.error('Hiba történt: ' + error.message);
    },
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Elfogadva</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Elutasítva</Badge>;
      default:
        return <Badge variant="secondary">Függőben</Badge>;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {bookings?.map((booking) => (
        <Card key={booking.id} className="relative">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">
                {booking.guest_name}
              </CardTitle>
              {getStatusBadge(booking.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {booking.guest_email}
              </div>
              {booking.guest_phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {booking.guest_phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {booking.number_of_people} fő
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {format(new Date(booking.booking_date), 'yyyy.MM.dd HH:mm')}
              </div>
            </div>
            
            {booking.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => 
                    updateBookingStatus.mutate({ 
                      id: booking.id, 
                      status: 'confirmed' 
                    })
                  }
                >
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Elfogad
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => 
                    updateBookingStatus.mutate({ 
                      id: booking.id, 
                      status: 'cancelled' 
                    })
                  }
                >
                  <X className="w-4 h-4 mr-2 text-red-500" />
                  Elutasít
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}