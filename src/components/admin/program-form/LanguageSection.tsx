import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface LanguageSectionProps {
  form: UseFormReturn<FormValues>;
  language: "hu" | "en" | "ro";
  title: string;
  titleLabel: string;
  descriptionLabel: string;
}

export function LanguageSection({ 
  form, 
  language, 
  title, 
  titleLabel, 
  descriptionLabel 
}: LanguageSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <FormField
        control={form.control}
        name={`${language}_title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{titleLabel}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${language}_description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{descriptionLabel}</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}