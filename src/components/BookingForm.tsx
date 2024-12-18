import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Currency } from "@/types/program";
import { formatCurrency } from "@/utils/currency";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  programTitle: string;
  pricePerPerson: number;
  currency: Currency;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "A név legalább 2 karakter hosszú kell legyen" }),
  phone: z.string().min(6, { message: "Érvényes telefonszámot adjon meg" }),
  bookingNumber: z.string().optional(),
  numberOfPeople: z.number().min(1, { message: "Legalább 1 fő szükséges" }),
  date: z.date({
    required_error: "Kérjük válasszon dátumot",
  }),
});

export function BookingForm({ isOpen, onClose, programTitle, pricePerPerson, currency }: BookingFormProps) {
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
    // Here you would typically send the booking data to your backend
    onClose();
  }

  const numberOfPeople = form.watch("numberOfPeople") || 1;
  const totalPrice = numberOfPeople * pricePerPerson;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{programTitle} foglalás</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Név</FormLabel>
                  <FormControl>
                    <Input placeholder="Az Ön neve" {...field} />
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
                  <FormLabel>Telefonszám</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefonszám" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abod Retreat foglalási szám (opcionális)</FormLabel>
                  <FormControl>
                    <Input placeholder="Foglalási szám" {...field} />
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
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
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
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-lg font-semibold">
              Összesen: {formatCurrency(totalPrice, currency)}
              <span className="text-sm font-normal ml-2">({formatCurrency(pricePerPerson, currency)}/fő)</span>
            </div>

            <Button type="submit" className="w-full">
              Foglalás véglegesítése
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}