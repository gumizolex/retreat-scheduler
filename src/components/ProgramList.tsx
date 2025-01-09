import { useState } from "react";
import { BookingForm } from "./BookingForm";
import { Language, Currency } from "@/types/program";
import { ProgramGrid } from "./programs/ProgramGrid";
import { usePrograms } from "@/hooks/usePrograms";
import { getTranslations } from "./programs/TranslationsProvider";
import { toast } from "@/components/ui/use-toast";

export function ProgramList({ onLanguageChange }: { onLanguageChange?: (lang: Language) => void }) {
  const [language, setLanguage] = useState<Language>("hu");
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>("RON");

  console.log('ProgramList rendering, current language:', language);

  const { data: programsData, isLoading, error } = usePrograms();

  if (error) {
    console.error('Error loading programs:', error);
    toast({
      title: "Error",
      description: "Failed to load programs. Please try again.",
      variant: "destructive",
    });
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <p className="text-red-500 mb-4">Error loading programs</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!programsData || programsData.length === 0) {
    console.log('No programs found');
    return (
      <div className="flex justify-center items-center min-h-[400px] p-4 text-center">
        <p className="text-gray-500">No programs available at the moment</p>
      </div>
    );
  }

  const translations = getTranslations(programsData);

  const handleLanguageChange = (newLanguage: Language) => {
    console.log('Language changed to:', newLanguage);
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-secondary/20">
      <div className="container mx-auto py-6 md:py-12 px-4 sm:px-6 lg:px-8">
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