import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Language, Currency } from "@/types/program";
import { BookingPersonalInfo } from "./booking/BookingPersonalInfo";
import { BookingDateTime } from "./booking/BookingDateTime";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "A név legalább 2 karakter hosszú kell legyen.",
  }),
  email: z.string().email({
    message: "Érvénytelen email cím.",
  }),
  phone: z.string().min(6, {
    message: "A telefonszám kötelező és legalább 6 karakter hosszú kell legyen.",
  }),
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

export function BookingForm({ isOpen, onClose, programId = 1, language }: BookingFormProps) {
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

  const translations = {
    hu: {
      title: "Foglalás",
      name: "Név",
      email: "Email",
      phone: "Telefonszám",
      date: "Dátum",
      time: "Időpont",
      people: "Létszám",
      cancel: "Mégsem",
      submit: "Foglalás véglegesítése",
      processing: "Feldolgozás...",
      successMessage: "Foglalás sikeresen elmentve! Hamarosan felvesszük Önnel a kapcsolatot.",
    },
    en: {
      title: "Booking",
      name: "Name",
      email: "Email",
      phone: "Phone",
      date: "Date",
      time: "Time",
      people: "Number of people",
      cancel: "Cancel",
      submit: "Confirm Booking",
      processing: "Processing...",
      successMessage: "Booking successfully saved! We will contact you soon.",
    },
    ro: {
      title: "Rezervare",
      name: "Nume",
      email: "Email",
      phone: "Telefon",
      date: "Data",
      time: "Ora",
      people: "Număr de persoane",
      cancel: "Anulare",
      submit: "Confirmă Rezervarea",
      processing: "Se procesează...",
      successMessage: "Rezervare salvată cu succes! Vă vom contacta în curând.",
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      const bookingDate = new Date(values.date);
      const [hours, minutes] = values.time.split(':').map(Number);
      
      bookingDate.setHours(hours || 0);
      bookingDate.setMinutes(minutes || 0);
      bookingDate.setSeconds(0);
      bookingDate.setMilliseconds(0);

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

      if (error) throw error;

      toast.success(translations[language].successMessage);
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
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{translations[language].title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BookingPersonalInfo 
              form={form}
              language={language}
              translations={translations}
            />
            
            <BookingDateTime
              form={form}
              language={language}
              translations={translations}
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