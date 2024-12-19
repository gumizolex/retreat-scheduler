import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface LanguageSectionProps {
  form: UseFormReturn<FormValues>;
}

type LanguageConfig = {
  code: 'hu' | 'en' | 'ro';
  title: string;
  titleLabel: string;
  descriptionLabel: string;
}

export function LanguageSection({ form }: LanguageSectionProps) {
  const languages: LanguageConfig[] = [
    {
      code: 'hu',
      title: 'Magyar',
      titleLabel: 'Magyar cím',
      descriptionLabel: 'Magyar leírás'
    },
    {
      code: 'en',
      title: 'English',
      titleLabel: 'English title',
      descriptionLabel: 'English description'
    },
    {
      code: 'ro',
      title: 'Română',
      titleLabel: 'Titlu în română',
      descriptionLabel: 'Descriere în română'
    }
  ];

  return (
    <div className="space-y-8">
      {languages.map(lang => (
        <div key={lang.code} className="space-y-4">
          <h3 className="text-lg font-semibold">{lang.title}</h3>
          <FormField
            control={form.control}
            name={`${lang.code}_title` as keyof FormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang.titleLabel}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${lang.code}_description` as keyof FormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{lang.descriptionLabel}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}