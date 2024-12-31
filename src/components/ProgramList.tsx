import { useState, useEffect } from "react";
import { BookingForm } from "./BookingForm";
import { Language, Currency, Program } from "@/types/program";
import { ProgramHeader } from "./programs/ProgramHeader";
import { ProgramGrid } from "./programs/ProgramGrid";
import { usePrograms } from "@/hooks/usePrograms";
import { Loader } from "lucide-react";

export function ProgramList({ onLanguageChange }: { onLanguageChange?: (lang: Language) => void }) {
  const [language, setLanguage] = useState<Language>("hu");
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>("RON");
  
  const { data: programsData, isLoading, error } = usePrograms();

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
      loading: "Loading...",
      error: "Error loading programs",
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
      loading: "Se încarcă...",
      error: "Eroare la încărcarea programelor",
      programs: programsData?.map(program => ({
        id: program.id,
        title: program.program_translations.find(t => t.language === "ro")?.title || '',
        description: program.program_translations.find(t => t.language === "ro")?.description || '',
      })) || []
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-lg text-gray-600">{translations[language].loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-red-600">{translations[language].error}</p>
        </div>
      </div>
    );
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