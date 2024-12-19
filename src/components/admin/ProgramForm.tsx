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
import { createNewProgram, updateExistingProgram } from "./program-form/programFormActions";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProgramFormProps {
  initialData?: Program;
  onSuccess?: () => void;
}

export function ProgramForm({ initialData, onSuccess }: ProgramFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        navigate('/');
        return;
      }

      setIsAdmin(true);
    };

    checkAdminAccess();
  }, [navigate]);

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
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Hiba!",
        description: "Nincs jogosultsága a program módosításához.",
      });
      return;
    }

    try {
      console.log('Starting form submission with values:', values);

      if (initialData?.id) {
        await updateExistingProgram(values, initialData.id);
        
        toast({
          title: "Siker!",
          description: "A program sikeresen frissítve.",
        });
      } else {
        await createNewProgram(values);
        
        toast({
          title: "Siker!",
          description: "Az új program sikeresen létrehozva.",
        });
      }

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

  if (!isAdmin) {
    return null;
  }

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