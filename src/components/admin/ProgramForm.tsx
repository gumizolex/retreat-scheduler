import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Program } from "@/types/program";
import { BasicDetails } from "./program-form/BasicDetails";
import { LanguageSection } from "./program-form/LanguageSection";
import { formSchema, type FormValues } from "./program-form/types";
import { exchangeRates } from "@/utils/currency";

interface ProgramFormProps {
  program?: Program | null;
  onClose: () => void;
}

export function ProgramForm({ program, onClose }: ProgramFormProps) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Convert RON to HUF for the form if program exists
      price: program ? (Math.round(program.price / exchangeRates.RON)).toString() : "",
      duration: program?.duration || "",
      location: program?.location || "",
      hu_title: program?.program_translations?.find(t => t.language === "hu")?.title || "",
      hu_description: program?.program_translations?.find(t => t.language === "hu")?.description || "",
      en_title: program?.program_translations?.find(t => t.language === "en")?.title || "",
      en_description: program?.program_translations?.find(t => t.language === "en")?.description || "",
      ro_title: program?.program_translations?.find(t => t.language === "ro")?.title || "",
      ro_description: program?.program_translations?.find(t => t.language === "ro")?.description || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Convert RON to HUF for storage
      const priceInHUF = Math.round(parseFloat(values.price) / exchangeRates.RON);

      if (program) {
        // Update existing program
        const { error: programError } = await supabase
          .from('programs')
          .update({
            price: priceInHUF,
            duration: values.duration,
            location: values.location,
          })
          .eq('id', program.id);

        if (programError) throw programError;

        // Update translations
        const languages = ['hu', 'en', 'ro'] as const;
        for (const lang of languages) {
          const { error: translationError } = await supabase
            .from('program_translations')
            .update({
              title: values[`${lang}_title` as keyof FormValues],
              description: values[`${lang}_description` as keyof FormValues],
            })
            .eq('program_id', program.id)
            .eq('language', lang);

          if (translationError) throw translationError;
        }

        toast({
          title: "Sikeres mentés",
          description: "A program módosításai elmentve.",
        });
      } else {
        // Create new program
        const { data: newProgram, error: programError } = await supabase
          .from('programs')
          .insert({
            price: priceInHUF,
            duration: values.duration,
            location: values.location,
          })
          .select()
          .single();

        if (programError) throw programError;

        // Insert translations
        const translations = [
          { language: 'hu', title: values.hu_title, description: values.hu_description },
          { language: 'en', title: values.en_title, description: values.en_description },
          { language: 'ro', title: values.ro_title, description: values.ro_description },
        ].map(t => ({
          ...t,
          program_id: newProgram.id,
        }));

        const { error: translationsError } = await supabase
          .from('program_translations')
          .insert(translations);

        if (translationsError) throw translationsError;

        toast({
          title: "Sikeres létrehozás",
          description: "Az új program sikeresen létrehozva.",
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        title: "Hiba történt",
        description: "A program mentése sikertelen.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicDetails form={form} />
        
        <LanguageSection
          form={form}
          language="hu"
          title="Magyar"
          titleLabel="Cím"
          descriptionLabel="Leírás"
        />

        <LanguageSection
          form={form}
          language="en"
          title="English"
          titleLabel="Title"
          descriptionLabel="Description"
        />

        <LanguageSection
          form={form}
          language="ro"
          title="Română"
          titleLabel="Titlu"
          descriptionLabel="Descriere"
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Mégse
          </Button>
          <Button type="submit">
            {program ? 'Mentés' : 'Létrehozás'}
          </Button>
        </div>
      </form>
    </Form>
  );
}