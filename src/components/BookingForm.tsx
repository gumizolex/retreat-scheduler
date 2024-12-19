import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/DateTimePicker";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Language, Currency } from "@/types/program";

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
  currency: Currency;
  language: Language;
}

export function BookingForm({ isOpen, onClose, programId = 1, language, currency }: BookingFormProps) {
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

  const translations = {
    hu: {
      title: "Foglalás",
      name: "Név",
      email: "Email",
      phone: "Telefonszám (opcionális)",
      date: "Dátum",
      time: "Időpont",
      people: "Létszám",
      cancel: "Mégsem",
      submit: "Foglalás véglegesítése",
      processing: "Feldolgozás...",
    },
    en: {
      title: "Booking",
      name: "Name",
      email: "Email",
      phone: "Phone (optional)",
      date: "Date",
      time: "Time",
      people: "Number of people",
      cancel: "Cancel",
      submit: "Confirm Booking",
      processing: "Processing...",
    },
    ro: {
      title: "Rezervare",
      name: "Nume",
      email: "Email",
      phone: "Telefon (opțional)",
      date: "Data",
      time: "Ora",
      people: "Număr de persoane",
      cancel: "Anulare",
      submit: "Confirmă Rezervarea",
      processing: "Se procesează...",
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations[language].title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations[language].name}</FormLabel>
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
                  <FormLabel>{translations[language].email}</FormLabel>
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
                  <FormLabel>{translations[language].phone}</FormLabel>
                  <FormControl>
                    <Input placeholder="+36 XX XXX XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DateTimePicker
              form={form}
              language={language}
              translations={translations}
            />

            <FormField
              control={form.control}
              name="numberOfPeople"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations[language].people}</FormLabel>
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
                {translations[language].cancel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? translations[language].processing : translations[language].submit}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}