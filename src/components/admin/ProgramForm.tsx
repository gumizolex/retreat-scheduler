import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicDetails } from "./program-form/BasicDetails";
import { LanguageSection } from "./program-form/LanguageSection";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Program } from "@/types/program";
import { formSchema, FormValues } from "./program-form/types";

interface ProgramFormProps {
  initialData?: Program;
  onSuccess?: () => void;
}

export function ProgramForm({ initialData, onSuccess }: ProgramFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || 0,
      duration: initialData?.duration || "",
      location: initialData?.location || "",
      hu_title: initialData?.program_translations?.find(t => t.language === "hu")?.title || "",
      hu_description: initialData?.program_translations?.find(t => t.language === "hu")?.description || "",
      en_title: initialData?.program_translations?.find(t => t.language === "en")?.title || "",
      en_description: initialData?.program_translations?.find(t => t.language === "en")?.description || "",
      ro_title: initialData?.program_translations?.find(t => t.language === "ro")?.title || "",
      ro_description: initialData?.program_translations?.find(t => t.language === "ro")?.description || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      console.log('Starting form submission with values:', values);

      if (initialData?.id) {
        console.log('Updating existing program with ID:', initialData.id);
        
        // Update program details
        const { data: updatedProgram, error: programError } = await supabase
          .from('programs')
          .update({
            price: values.price,
            duration: values.duration,
            location: values.location,
          })
          .eq('id', initialData.id)
          .select()
          .maybeSingle();

        if (programError) {
          console.error('Error updating program:', programError);
          throw programError;
        }

        if (!updatedProgram) {
          throw new Error('Program not found or could not be updated');
        }

        console.log('Successfully updated program:', updatedProgram);

        // Update translations one by one
        const languages = ['hu', 'en', 'ro'] as const;
        for (const lang of languages) {
          console.log(`Updating ${lang} translation for program ${initialData.id}`);
          
          const existingTranslation = initialData.program_translations.find(t => t.language === lang);
          
          if (existingTranslation) {
            const { data: updatedTranslation, error: translationError } = await supabase
              .from('program_translations')
              .update({
                title: String(values[`${lang}_title` as keyof FormValues]),
                description: String(values[`${lang}_description` as keyof FormValues]),
              })
              .eq('program_id', initialData.id)
              .eq('language', lang)
              .select()
              .maybeSingle();

            if (translationError) {
              console.error(`Error updating ${lang} translation:`, translationError);
              throw translationError;
            }

            if (!updatedTranslation) {
              throw new Error(`Translation for language ${lang} not found or could not be updated`);
            }

            console.log(`Successfully updated ${lang} translation:`, updatedTranslation);
          } else {
            // If translation doesn't exist, create it
            const { data: newTranslation, error: translationError } = await supabase
              .from('program_translations')
              .insert({
                program_id: initialData.id,
                language: lang,
                title: String(values[`${lang}_title` as keyof FormValues]),
                description: String(values[`${lang}_description` as keyof FormValues]),
              })
              .select()
              .maybeSingle();

            if (translationError) {
              console.error(`Error creating ${lang} translation:`, translationError);
              throw translationError;
            }

            if (!newTranslation) {
              throw new Error(`Could not create translation for language ${lang}`);
            }

            console.log(`Successfully created ${lang} translation:`, newTranslation);
          }
        }
      } else {
        console.log('Creating new program');
        // Create new program
        const { data: newProgram, error: programError } = await supabase
          .from('programs')
          .insert({
            price: values.price,
            duration: values.duration,
            location: values.location,
          })
          .select()
          .maybeSingle();

        if (programError) {
          console.error('Error creating program:', programError);
          throw programError;
        }

        if (!newProgram) {
          throw new Error('Could not create new program');
        }

        console.log('Created new program:', newProgram);

        // Insert translations
        const translations = ['hu', 'en', 'ro'].map(lang => ({
          program_id: newProgram.id,
          language: lang,
          title: String(values[`${lang}_title` as keyof FormValues]),
          description: String(values[`${lang}_description` as keyof FormValues]),
        }));

        const { data: newTranslations, error: translationsError } = await supabase
          .from('program_translations')
          .insert(translations)
          .select();

        if (translationsError) {
          console.error('Error creating translations:', translationsError);
          throw translationsError;
        }

        if (!newTranslations || newTranslations.length === 0) {
          throw new Error('Could not create translations');
        }

        console.log('Successfully created translations:', newTranslations);
      }

      // Force refetch the data
      await queryClient.invalidateQueries({ queryKey: ['programs'] });
      await queryClient.refetchQueries({ queryKey: ['programs'] });
      
      toast({
        title: "Siker!",
        description: initialData ? "A program sikeresen frissítve." : "Az új program sikeresen létrehozva.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast({
        variant: "destructive",
        title: "Hiba!",
        description: error.message || "Váratlan hiba történt",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicDetails form={form} />
        <LanguageSection form={form} />
        
        <Button type="submit" className="w-full">
          {initialData ? "Mentés" : "Program létrehozása"}
        </Button>
      </form>
    </Form>
  );
}