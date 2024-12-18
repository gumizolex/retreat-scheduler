import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Currency, Language } from "@/types/program";
import { formatCurrency } from "@/utils/currency";
import { motion } from "framer-motion";

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
    submit: "Foglalás véglegesítése"
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
    submit: "Confirm Booking"
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
    submit: "Confirmă Rezervarea"
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
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    onClose();
  }

  const numberOfPeople = form.watch("numberOfPeople") || 1;
  const totalPrice = numberOfPeople * pricePerPerson;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto bg-gradient-to-br from-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SheetHeader className="space-y-4 pb-6 border-b">
            <SheetTitle className="text-2xl font-display text-accent">{programTitle} {t.booking}</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="group">
                      <FormLabel className="text-accent font-medium">{t.name}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t.namePlaceholder} 
                          {...field} 
                          className="text-accent transition-all duration-300 border-gray-200 focus:border-primary hover:border-primary/50" 
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-accent font-medium">{t.phone}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t.phonePlaceholder} 
                          {...field} 
                          className="text-accent transition-all duration-300 border-gray-200 focus:border-primary hover:border-primary/50" 
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bookingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-accent font-medium">{t.bookingNumber}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t.bookingNumberPlaceholder} 
                          {...field} 
                          className="text-accent transition-all duration-300 border-gray-200 focus:border-primary hover:border-primary/50" 
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfPeople"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-accent font-medium">{t.numberOfPeople}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          className="text-accent transition-all duration-300 border-gray-200 focus:border-primary hover:border-primary/50"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-accent font-medium">{t.date}</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        className="rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300"
                      />
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="pt-6 border-t"
              >
                <div className="text-xl font-semibold text-accent mb-6">
                  {t.total}: {formatCurrency(totalPrice, currency)}
                  <span className="text-sm font-normal ml-2 text-accent/80">
                    ({formatCurrency(pricePerPerson, currency)}{t.perPerson})
                  </span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  {t.submit}
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}