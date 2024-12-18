import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Booking {
  id: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  booking_date: string;
  number_of_people: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  program_id: number;
}

interface BookingsTableProps {
  bookings: Booking[];
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const queryClient = useQueryClient();

  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
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

  const getStatusBadge = (status: string) => {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendég neve</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Dátum</TableHead>
            <TableHead>Létszám</TableHead>
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
              <TableCell>
                {format(new Date(booking.booking_date), 'yyyy.MM.dd HH:mm')}
              </TableCell>
              <TableCell>{booking.number_of_people}</TableCell>
              <TableCell>{getStatusBadge(booking.status)}</TableCell>
              <TableCell>
                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0"
                      onClick={() => 
                        updateBookingStatus.mutate({ 
                          id: booking.id, 
                          status: 'confirmed' 
                        })
                      }
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0"
                      onClick={() => 
                        updateBookingStatus.mutate({ 
                          id: booking.id, 
                          status: 'cancelled' 
                        })
                      }
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}