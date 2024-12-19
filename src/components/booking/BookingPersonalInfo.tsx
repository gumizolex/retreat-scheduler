import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Language } from "@/types/program";

interface BookingPersonalInfoProps {
  form: UseFormReturn<any>;
  language: Language;
  translations: Record<Language, any>;
}

export function BookingPersonalInfo({ form, language, translations }: BookingPersonalInfoProps) {
  const t = translations[language];
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.name}</FormLabel>
            <FormControl>
              <Input placeholder={t.name} {...field} />
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
            <FormLabel>{t.email}</FormLabel>
            <FormControl>
              <Input type="email" placeholder="email@example.com" {...field} />
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
            <FormLabel>{t.phone}</FormLabel>
            <FormControl>
              <Input placeholder="+36 XX XXX XXXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}