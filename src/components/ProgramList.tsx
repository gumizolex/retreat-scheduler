import { useState } from "react";
import { BookingForm } from "./BookingForm";
import { Language, Currency, Program } from "@/types/program";
import { ProgramHeader } from "./programs/ProgramHeader";
import { ProgramGrid } from "./programs/ProgramGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ProgramList({ onLanguageChange }: { onLanguageChange?: (lang: Language) => void }) {
  const [language, setLanguage] = useState<Language>("hu");
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [currency, setCurrency] = useState<Currency>("RON");

  const { data: programsData, isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      console.log('Fetching programs for activities page...');
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

      console.log('Fetched programs:', programs);
      return programs;
    },
  });

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  // Transform the data to match the expected format
  const translations = {
    [language]: {
      pageTitle: language === "hu" ? "Programok és Élmények" : 
                 language === "en" ? "Programs and Experiences" : 
                 "Programe și Experiențe",
      bookButton: language === "hu" ? "Foglalás" : 
                  language === "en" ? "Book Now" : 
                  "Rezervare",
      timesAvailable: language === "hu" ? "Elérhető időpontok" :
                     language === "en" ? "Times Available" :
                     "Ore disponibile",
      programs: programsData?.map(program => ({
        id: program.id,
        title: program.program_translations.find(t => t.language === language)?.title || '',
        description: program.program_translations.find(t => t.language === language)?.description || '',
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
            onBookProgram={setSelectedProgram}
          />
        </div>

        {selectedProgram && (
          <BookingForm
            isOpen={selectedProgram !== null}
            onClose={() => setSelectedProgram(null)}
            programTitle={
              translations[language].programs.find(
                (p) => p.id === selectedProgram
              )?.title || ""
            }
            pricePerPerson={
              programsData?.find((p) => p.id === selectedProgram)?.price || 0
            }
            currency={currency}
            language={language}
          />
        )}
      </div>
    </div>
  );
}