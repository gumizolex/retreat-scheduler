import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicDetails } from "./program-form/BasicDetails";
import { LanguageSection } from "./program-form/LanguageSection";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Program } from "@/types/program";
import { formSchema, FormValues } from "./program-form/types";
import { createNewProgram, updateExistingProgram, updateProgramTranslation } from "./program-form/programFormActions";

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
        // Először frissítjük a program alapadatait
        await updateExistingProgram(values, initialData.id);

        // Majd frissítjük a fordításokat nyelvenként
        const languages = ['hu', 'en', 'ro'] as const;
        for (const lang of languages) {
          const existingTranslation = initialData.program_translations.find(t => t.language === lang);
          await updateProgramTranslation(
            initialData.id,
            lang,
            String(values[`${lang}_title` as keyof FormValues]),
            String(values[`${lang}_description` as keyof FormValues]),
            !existingTranslation
          );
        }

        toast({
          title: "Siker!",
          description: "A program sikeresen frissítve.",
        });
      } else {
        // Új program létrehozása
        await createNewProgram(values);
        
        toast({
          title: "Siker!",
          description: "Az új program sikeresen létrehozva.",
        });
      }

      // Frissítjük a cache-t
      await queryClient.invalidateQueries({ queryKey: ['programs'] });
      
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