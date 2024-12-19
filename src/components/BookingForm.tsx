import { Form } from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Currency, Language } from "@/types/program";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, CalendarDays, FileText, User } from "lucide-react";
import { BookingFormFields } from "./booking/BookingFormFields";
import { BookingPriceSummary } from "./booking/BookingPriceSummary";
import { BookingProgressSteps } from "./booking/BookingProgressSteps";
import { BookingSummaryDetails } from "./booking/BookingSummaryDetails";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  programTitle: string;
  pricePerPerson: number;
  currency: Currency;
  language: Language;
}

const translations = {
  hu: {
    steps: {
      selectDate: "Időpont választása",
      details: "Személyes adatok",
      summary: "Összegzés"
    },
    booking: "foglalás",
    name: "Név",
    namePlaceholder: "Az Ön neve",
    nameError: "A név legalább 2 karakter hosszú kell legyen",
    email: "Email cím",
    emailPlaceholder: "Az Ön email címe",
    emailError: "Kérjük adjon meg egy érvényes email címet",
    phone: "Telefonszám",
    phonePlaceholder: "Telefonszám",
    phoneError: "Érvényes telefonszámot adjon meg",
    bookingNumber: "Abod Retreat foglalási szám (opcionális)",
    bookingNumberPlaceholder: "Foglalási szám",
    numberOfPeople: "Létszám",
    date: "Dátum",
    dateError: "Kérjük válasszon dátumot",
    perPerson: "/fő",
    total: "Összesen",
    submit: "Foglalás véglegesítése",
    time: "Időpont",
    selectTime: "Válasszon időpontot",
    next: "Következő",
    back: "Vissza",
    program: "Program",
    bookingDetails: "Foglalás részletei"
  },
  en: {
    steps: {
      selectDate: "Select Date",
      details: "Personal Details",
      summary: "Summary"
    },
    booking: "booking",
    name: "Name",
    namePlaceholder: "Your name",
    nameError: "Name must be at least 2 characters long",
    email: "Email address",
    emailPlaceholder: "Your email address",
    emailError: "Please provide a valid email address",
    phone: "Phone number",
    phonePlaceholder: "Phone number",
    phoneError: "Please provide a valid phone number",
    bookingNumber: "Abod Retreat booking number (optional)",
    bookingNumberPlaceholder: "Booking number",
    numberOfPeople: "Number of people",
    date: "Date",
    dateError: "Please select a date",
    perPerson: "/person",
    total: "Total",
    submit: "Confirm Booking",
    time: "Time",
    selectTime: "Select time",
    next: "Next",
    back: "Back",
    program: "Program",
    bookingDetails: "Booking Details"
  },
  ro: {
    steps: {
      selectDate: "Selectează data",
      details: "Date personale",
      summary: "Sumar"
    },
    booking: "rezervare",
    name: "Nume",
    namePlaceholder: "Numele dumneavoastră",
    nameError: "Numele trebuie să aibă cel puțin 2 caractere",
    email: "Adresă de email",
    emailPlaceholder: "Adresa dumneavoastră de email",
    emailError: "Vă rugăm să furnizați o adresă de email validă",
    phone: "Număr de telefon",
    phonePlaceholder: "Număr de telefon",
    phoneError: "Vă rugăm să furnizați un număr de telefon valid",
    bookingNumber: "Număr de rezervare Abod Retreat (opțional)",
    bookingNumberPlaceholder: "Număr de rezervare",
    numberOfPeople: "Număr de persoane",
    date: "Data",
    dateError: "Vă rugăm să selectați o dată",
    perPerson: "/persoană",
    total: "Total",
    submit: "Confirmă Rezervarea",
    time: "Ora",
    selectTime: "Selectați ora",
    next: "Următorul",
    back: "Înapoi",
    program: "Program",
    bookingDetails: "Detalii Rezervare"
  }
};

const getFormSchema = (t: typeof translations.hu) => z.object({
  name: z.string().min(2, { message: t.nameError }),
  email: z.string().email({ message: t.emailError }),
  phone: z.string().min(6, { message: t.phoneError }),
  bookingNumber: z.string().optional(),
  numberOfPeople: z.number().min(1, { message: "1" }),
  date: z.date({
    required_error: t.dateError,
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
});

export function BookingForm({ 
  isOpen, 
  onClose, 
  programTitle, 
  pricePerPerson, 
  currency, 
  language 
}: BookingFormProps) {
  const [step, setStep] = useState(0);
  const t = translations[language];
  const formSchema = getFormSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      bookingNumber: "",
      numberOfPeople: 1,
      time: "",
    },
  });

  const steps = [
    { icon: CalendarDays, title: t.steps.selectDate },
    { icon: FileText, title: t.steps.details },
    { icon: User, title: t.steps.summary }
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Combine date and time
      const bookingDateTime = new Date(values.date);
      const [hours, minutes] = values.time.split(':');
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes));

      console.log('Submitting booking with data:', {
        guest_name: values.name,
        guest_phone: values.phone,
        booking_date: bookingDateTime.toISOString(),
        number_of_people: values.numberOfPeople,
        program_id: 1,
        guest_email: 'test@example.com'
      });

      const { error } = await supabase
        .from('bookings')
        .insert({
          guest_name: values.name,
          guest_phone: values.phone,
          booking_date: bookingDateTime.toISOString(),
          number_of_people: values.numberOfPeople,
          program_id: 1, // You might want to make this dynamic based on the program
          guest_email: 'test@example.com', // This should be collected in the form
        });

      if (error) {
        console.error('Error inserting booking:', error);
        toast.error('Hiba történt a foglalás mentése közben');
        return;
      }

      toast.success('Foglalás sikeresen elmentve!');
      onClose();
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Váratlan hiba történt');
    }
  }

  const numberOfPeople = form.watch("numberOfPeople") || 1;
  const totalPrice = numberOfPeople * pricePerPerson;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] w-[90vw] mx-auto p-0 overflow-hidden bg-white rounded-xl">
        <div className="relative w-full">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
          
          <div className="border-b w-full">
            <BookingProgressSteps steps={steps} currentStep={step} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 sm:p-4 w-full"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3 w-full"
                    >
                      <h2 className="text-lg sm:text-xl font-display text-accent mb-4">
                        {programTitle} {t.booking}
                      </h2>
                      <BookingFormFields 
                        form={form}
                        t={t}
                        language={language}
                        translations={translations}
                        showDateOnly
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="bg-primary text-white px-5 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                        >
                          {t.next}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3 w-full"
                    >
                      <BookingFormFields 
                        form={form}
                        t={t}
                        language={language}
                        translations={translations}
                        showPersonalInfo
                      />
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(0)}
                          className="text-gray-600 px-5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                        >
                          {t.back}
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="bg-primary text-white px-5 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                        >
                          {t.next}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3 w-full"
                    >
                      <BookingSummaryDetails
                        formData={{
                          name: form.watch("name"),
                          date: form.watch("date"),
                          time: form.watch("time"),
                          numberOfPeople: form.watch("numberOfPeople")
                        }}
                        programTitle={programTitle}
                        language={language}
                        t={t}
                      />
                      <BookingPriceSummary
                        totalPrice={totalPrice}
                        pricePerPerson={pricePerPerson}
                        currency={currency}
                        t={t}
                        onSubmit={form.handleSubmit(onSubmit)}
                        showBackButton
                        onBack={() => setStep(1)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Form>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
