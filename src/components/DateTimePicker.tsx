import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Language } from "@/types/program";
import { UseFormReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const selectedDate = form.watch("date");

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-accent font-medium mb-1">
              {translations[language].date}
            </FormLabel>
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) => date < new Date()}
              className={cn(
                "rounded-lg border shadow-sm w-full scale-90 origin-top -mt-2 -mb-2",
                "bg-white dark:bg-gray-800"
              )}
            />
            <FormMessage className="text-destructive text-sm" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-accent font-medium">
              {translations[language].time}
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                  <SelectValue placeholder={translations[language].selectTime} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white dark:bg-gray-800 shadow-app-lg border-gray-200">
                {timeSlots.map((time) => (
                  <SelectItem 
                    key={time} 
                    value={time}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-destructive text-sm" />
          </FormItem>
        )}
      />
    </div>
  );
}