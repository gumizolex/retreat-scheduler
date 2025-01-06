import { useState } from "react";
import { BookingForm } from "./BookingForm";
import { Language, Currency, Program } from "@/types/program";
import { ProgramHeader } from "./programs/ProgramHeader";
import { ProgramGrid } from "./programs/ProgramGrid";
import { usePrograms } from "@/hooks/usePrograms";
import { useToast } from "@/components/ui/use-toast";

export function ProgramList({ onLanguageChange }: { onLanguageChange?: (lang: Language) => void }) {
  const [language, setLanguage] = useState<Language>("hu");
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>("RON");
  const { toast } = useToast();
  
  const { data: programsData, error, isLoading } = usePrograms();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching programs:', error);
    toast({
      variant: "destructive",
      title: "Hiba történt",
      description: "Nem sikerült betölteni a programokat",
    });
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Hiba történt a programok betöltése közben
      </div>
    );
  }

  if (!programsData || programsData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        Nincsenek elérhető programok
      </div>
    );
  }

  const translations: Record<Language, {
    pageTitle: string;
    bookButton: string;
    timesAvailable: string;
    duration: string;
    location: string;
    loading: string;
    error: string;
    programs: { id: number; title: string; description: string; }[];
  }> = {
    hu: {
      pageTitle: "Programok és Élmények",
      bookButton: "Foglalás",
      timesAvailable: "Elérhető időpontok",
      duration: "Időtartam",
      location: "Helyszín",
      loading: "Betöltés...",
      error: "Hiba történt a programok betöltése közben",
      programs: programsData.map(program => ({
        id: program.id,
        title: program.program_translations.find(t => t.language === "hu")?.title || '',
        description: program.program_translations.find(t => t.language === "hu")?.description || '',
      }))
    },
    en: {
      pageTitle: "Programs and Experiences",
      bookButton: "Book Now",
      timesAvailable: "Available Times",
      duration: "Duration",
      location: "Location",
      loading: "Loading...",
      error: "Error loading programs",
      programs: programsData.map(program => ({
        id: program.id,
        title: program.program_translations.find(t => t.language === "en")?.title || '',
        description: program.program_translations.find(t => t.language === "en")?.description || '',
      }))
    },
    ro: {
      pageTitle: "Programe și Experiențe",
      bookButton: "Rezervare",
      timesAvailable: "Ore disponibile",
      duration: "Durată",
      location: "Locație",
      loading: "Se încarcă...",
      error: "Eroare la încărcarea programelor",
      programs: programsData.map(program => ({
        id: program.id,
        title: program.program_translations.find(t => t.language === "ro")?.title || '',
        description: program.program_translations.find(t => t.language === "ro")?.description || '',
      }))
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

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
            programs={programsData}
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