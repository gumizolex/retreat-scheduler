import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Language } from "@/types/program";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";

interface DateTimePickerProps {
  form: UseFormReturn<any>;
  language: Language;
  translations: Record<string, any>;
}

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
};

export function DateTimePicker({ form, language, translations }: DateTimePickerProps) {
  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-accent font-medium">{translations[language].date}</FormLabel>
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

      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-accent font-medium">{translations[language].time}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={translations[language].selectTime} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
    </div>
  );
}