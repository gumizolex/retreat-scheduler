import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/DateTimePicker";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "A név legalább 2 karakter hosszú kell legyen.",
  }),
  email: z.string().email({
    message: "Érvénytelen email cím.",
  }),
  phone: z.string().optional(),
  date: z.date({
    required_error: "Kérjük válassz egy dátumot.",
  }),
  time: z.string({
    required_error: "Kérjük válassz egy időpontot.",
  }),
  numberOfPeople: z.number().min(1, {
    message: "Legalább 1 fő szükséges.",
  }),
});

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  programId?: number;
}

export function BookingForm({ isOpen, onClose, programId = 1 }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      numberOfPeople: 1,
      time: "10:00",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      // Create a new date object for the booking date
      const bookingDate = new Date(values.date);
      
      // Parse the time string (expected format: "HH:mm")
      const [hours, minutes] = values.time.split(':').map(Number);
      
      // Set the time on the booking date
      bookingDate.setHours(hours || 0);
      bookingDate.setMinutes(minutes || 0);
      bookingDate.setSeconds(0);
      bookingDate.setMilliseconds(0);

      console.log('Submitting booking with data:', {
        guest_name: values.name,
        guest_email: values.email,
        guest_phone: values.phone,
        booking_date: bookingDate.toISOString(),
        number_of_people: values.numberOfPeople,
        program_id: programId,
      });

      const { error } = await supabase
        .from('bookings')
        .insert({
          guest_name: values.name,
          guest_email: values.email,
          guest_phone: values.phone,
          booking_date: bookingDate.toISOString(),
          number_of_people: values.numberOfPeople,
          program_id: programId,
        });

      if (error) {
        console.error('Error inserting booking:', error);
        throw error;
      }

      toast.success('Foglalás sikeresen elmentve!');
      onClose();
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast.error('Váratlan hiba történt');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Foglalás</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Név</FormLabel>
                  <FormControl>
                    <Input placeholder="Teljes név" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="pelda@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonszám (opcionális)</FormLabel>
                  <FormControl>
                    <Input placeholder="+36 XX XXX XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Dátum</FormLabel>
                  <DatePicker
                    date={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Időpont</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      step="900"
                      min="10:00"
                      max="18:00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfPeople"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Létszám</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Mégsem
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Feldolgozás..." : "Foglalás véglegesítése"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}