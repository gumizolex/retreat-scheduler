import { Form } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Currency, Language } from "@/types/program";
import { motion } from "framer-motion";
import { BookingFormFields } from "./booking/BookingFormFields";
import { BookingPriceSummary } from "./booking/BookingPriceSummary";

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
    booking: "foglalás",
    name: "Név",
    namePlaceholder: "Az Ön neve",
    nameError: "A név legalább 2 karakter hosszú kell legyen",
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
    selectTime: "Válasszon időpontot"
  },
  en: {
    booking: "booking",
    name: "Name",
    namePlaceholder: "Your name",
    nameError: "Name must be at least 2 characters long",
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
    selectTime: "Select time"
  },
  ro: {
    booking: "rezervare",
    name: "Nume",
    namePlaceholder: "Numele dumneavoastră",
    nameError: "Numele trebuie să aibă cel puțin 2 caractere",
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
    selectTime: "Selectați ora"
  }
};

const getFormSchema = (t: typeof translations.hu) => z.object({
  name: z.string().min(2, { message: t.nameError }),
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

export function BookingForm({ isOpen, onClose, programTitle, pricePerPerson, currency, language }: BookingFormProps) {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    onClose();
  }

  const numberOfPeople = form.watch("numberOfPeople") || 1;
  const totalPrice = numberOfPeople * pricePerPerson;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white rounded-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4"
        >
          <DialogHeader className="space-y-2 pb-4 border-b">
            <DialogTitle className="text-xl font-display text-accent">
              {programTitle} {t.booking}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <BookingFormFields 
                form={form}
                t={t}
                language={language}
                translations={translations}
              />

              <BookingPriceSummary
                totalPrice={totalPrice}
                pricePerPerson={pricePerPerson}
                currency={currency}
                t={t}
                onSubmit={form.handleSubmit(onSubmit)}
              />
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
