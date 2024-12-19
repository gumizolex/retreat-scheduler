import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "../DateTimePicker";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Language } from "@/types/program";

interface BookingFormFieldsProps {
  form: UseFormReturn<any>;
  t: any;
  language: Language;
  translations: any;
  showDateOnly?: boolean;
  showPersonalInfo?: boolean;
}

export function BookingFormFields({ 
  form, 
  t, 
  language, 
  translations,
  showDateOnly = false,
  showPersonalInfo = false
}: BookingFormFieldsProps) {
  if (showDateOnly) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
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

        <DateTimePicker 
          form={form}
          language={language}
          translations={translations}
        />
      </motion.div>
    );
  }

  if (showPersonalInfo) {
    return (
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
            <FormItem>
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
      </motion.div>
    );
  }

  return null;
}