import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Program } from "@/types/program";

const formSchema = z.object({
  price: z.string().min(1, "Az ár megadása kötelező"),
  duration: z.string().min(1, "Az időtartam megadása kötelező"),
  location: z.string().min(1, "A helyszín megadása kötelező"),
  hu_title: z.string().min(1, "A magyar cím megadása kötelező"),
  hu_description: z.string().min(1, "A magyar leírás megadása kötelező"),
  en_title: z.string().min(1, "Az angol cím megadása kötelező"),
  en_description: z.string().min(1, "Az angol leírás megadása kötelező"),
  ro_title: z.string().min(1, "A román cím megadása kötelező"),
  ro_description: z.string().min(1, "A román leírás megadása kötelező"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProgramFormProps {
  program?: Program | null;
  onClose: () => void;
}

export function ProgramForm({ program, onClose }: ProgramFormProps) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: program?.price?.toString() || "",
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
      if (program) {
        // Update existing program
        const { error: programError } = await supabase
          .from('programs')
          .update({
            price: parseInt(values.price),
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
            price: parseInt(values.price),
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ár (Ft)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Időtartam</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helyszín</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Magyar</h3>
          <FormField
            control={form.control}
            name="hu_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cím</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hu_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leírás</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">English</h3>
          <FormField
            control={form.control}
            name="en_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="en_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Română</h3>
          <FormField
            control={form.control}
            name="ro_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titlu</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ro_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descriere</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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