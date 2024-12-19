import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicDetails } from "./program-form/BasicDetails";
import { LanguageSection } from "./program-form/LanguageSection";
import { FormValues, formSchema } from "./program-form/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ProgramFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function ProgramForm({ initialData, onSuccess }: ProgramFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price?.toString() || "",
      duration: initialData?.duration || "",
      location: initialData?.location || "",
      hu_title: initialData?.program_translations?.find((t: any) => t.language === "hu")?.title || "",
      hu_description: initialData?.program_translations?.find((t: any) => t.language === "hu")?.description || "",
      en_title: initialData?.program_translations?.find((t: any) => t.language === "en")?.title || "",
      en_description: initialData?.program_translations?.find((t: any) => t.language === "en")?.description || "",
      ro_title: initialData?.program_translations?.find((t: any) => t.language === "ro")?.title || "",
      ro_description: initialData?.program_translations?.find((t: any) => t.language === "ro")?.description || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      console.log('Submitting form with values:', values);
      const price = parseInt(values.price);
      
      if (isNaN(price)) {
        throw new Error("Invalid price value");
      }

      if (initialData?.id) {
        console.log('Updating existing program with ID:', initialData.id);
        // Update existing program
        const { error: programError } = await supabase
          .from('programs')
          .update({
            price: price,
            duration: values.duration,
            location: values.location,
          })
          .eq('id', initialData.id);

        if (programError) {
          console.error('Error updating program:', programError);
          throw programError;
        }

        // Update translations
        const languages = ['hu', 'en', 'ro'] as const;
        for (const lang of languages) {
          console.log(`Updating ${lang} translation for program ${initialData.id}`);
          const { error: translationError } = await supabase
            .from('program_translations')
            .update({
              title: values[`${lang}_title`],
              description: values[`${lang}_description`],
            })
            .eq('program_id', initialData.id)
            .eq('language', lang);

          if (translationError) {
            console.error(`Error updating ${lang} translation:`, translationError);
            throw translationError;
          }
        }

        console.log('Successfully updated program and translations');
      } else {
        console.log('Creating new program');
        // Create new program
        const { data: program, error: programError } = await supabase
          .from('programs')
          .insert({
            price: price,
            duration: values.duration,
            location: values.location,
          })
          .select()
          .single();

        if (programError) {
          console.error('Error creating program:', programError);
          throw programError;
        }

        console.log('Created new program:', program);

        // Insert translations
        const translations = [
          { language: 'hu', title: values.hu_title, description: values.hu_description },
          { language: 'en', title: values.en_title, description: values.en_description },
          { language: 'ro', title: values.ro_title, description: values.ro_description },
        ].map(t => ({
          ...t,
          program_id: program.id,
        }));

        const { error: translationsError } = await supabase
          .from('program_translations')
          .insert(translations);

        if (translationsError) {
          console.error('Error creating translations:', translationsError);
          throw translationsError;
        }

        console.log('Successfully created translations');
      }

      // Invalidate and refetch queries
      await queryClient.invalidateQueries({ queryKey: ['programs'] });
      
      toast({
        title: initialData ? "Program frissítve" : "Program létrehozva",
        description: "A művelet sikeresen végrehajtva.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast({
        variant: "destructive",
        title: "Hiba történt",
        description: error.message || "Nem sikerült menteni a változtatásokat.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicDetails form={form} />
        <LanguageSection form={form} />
        <Button type="submit" className="w-full">
          {initialData ? "Mentés" : "Létrehozás"}
        </Button>
      </form>
    </Form>
  );
}