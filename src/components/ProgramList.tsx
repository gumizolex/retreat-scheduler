import { useState } from "react";
import { BookingForm } from "./BookingForm";
import { Language, Currency, Program } from "@/types/program";
import { ProgramHeader } from "./programs/ProgramHeader";
import { ProgramGrid } from "./programs/ProgramGrid";
import { translations, programs } from "@/data/programs";

export function ProgramList({ onLanguageChange }: { onLanguageChange?: (lang: Language) => void }) {
  const [language, setLanguage] = useState<Language>("hu");
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [currency, setCurrency] = useState<Currency>("HUF");

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
            programs={programs}
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
              programs.find((p) => p.id === selectedProgram)?.price || 0
            }
            currency={currency}
            language={language}
          />
        )}
      </div>
    </div>
  );
}