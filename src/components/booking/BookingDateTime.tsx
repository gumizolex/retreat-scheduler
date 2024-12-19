import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/DateTimePicker";
import { UseFormReturn } from "react-hook-form";
import { Language } from "@/types/program";

interface BookingDateTimeProps {
  form: UseFormReturn<any>;
  language: Language;
  translations: Record<Language, any>;
}

export function BookingDateTime({ form, language, translations }: BookingDateTimeProps) {
  const t = translations[language];
  
  return (
    <div className="space-y-4">
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
            <FormLabel>{t.people}</FormLabel>
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
    </div>
  );
}