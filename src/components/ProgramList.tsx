import { useState, useEffect } from "react";
import { BookingForm } from "./BookingForm";
import { Language, Currency, Program } from "@/types/program";
import { ProgramHeader } from "./programs/ProgramHeader";
import { ProgramGrid } from "./programs/ProgramGrid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ProgramList({ onLanguageChange }: { onLanguageChange?: (lang: Language) => void }) {
  const [language, setLanguage] = useState<Language>("hu");
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>("RON");
  const queryClient = useQueryClient();

  const { data: programsData, isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data: programs, error } = await supabase
        .from('programs')
        .select(`
          *,
          program_translations (
            language,
            title,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching programs:', error);
        throw error;
      }

      return programs as Program[];
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
  });

  useEffect(() => {
    const channel = supabase
      .channel('program-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'programs'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['programs'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'program_translations'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['programs'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  const translations: Record<Language, {
    pageTitle: string;
    bookButton: string;
    timesAvailable: string;
    duration: string;
    location: string;
    programs: { id: number; title: string; description: string; }[];
  }> = {
    hu: {
      pageTitle: "Programok és Élmények",
      bookButton: "Foglalás",
      timesAvailable: "Elérhető időpontok",
      duration: "Időtartam",
      location: "Helyszín",
      programs: programsData?.map(program => ({
        id: program.id,
        title: program.program_translations.find(t => t.language === "hu")?.title || '',
        description: program.program_translations.find(t => t.language === "hu")?.description || '',
      })) || []
    },
    en: {
      pageTitle: "Programs and Experiences",
      bookButton: "Book Now",
      timesAvailable: "Available Times",
      duration: "Duration",
      location: "Location",
      programs: programsData?.map(program => ({
        id: program.id,
        title: program.program_translations.find(t => t.language === "en")?.title || '',
        description: program.program_translations.find(t => t.language === "en")?.description || '',
      })) || []
    },
    ro: {
      pageTitle: "Programe și Experiențe",
      bookButton: "Rezervare",
      timesAvailable: "Ore disponibile",
      duration: "Durată",
      location: "Locație",
      programs: programsData?.map(program => ({
        id: program.id,
        title: program.program_translations.find(t => t.language === "ro")?.title || '',
        description: program.program_translations.find(t => t.language === "ro")?.description || '',
      })) || []
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-secondary/20">
      <div className="container mx-auto py-6 md:py-12 px-4 sm:px-6 lg:px-8">
        <ProgramHeader
          pageTitle={translations[language].pageTitle}
          language={language}
          currency={currency}
          onLanguageChange={handleLanguageChange}
          onCurrencyChange={setCurrency}
        />

        <div className="mt-6 md:mt-12">
          <ProgramGrid
            programs={programsData || []}
            translations={translations}
            language={language}
            currency={currency}
            onBookProgram={(programId: number, price: number) => {
              setSelectedProgram(programId);
              setSelectedPrice(price);
            }}
          />
        </div>

        {selectedProgram && (
          <BookingForm
            isOpen={selectedProgram !== null}
            onClose={() => {
              setSelectedProgram(null);
              setSelectedPrice(0);
            }}
            programId={selectedProgram}
            programPrice={selectedPrice}
            currency={currency}
            language={language}
          />
        )}
      </div>
    </div>
  );
}