import { useState } from "react";
import { Language, Currency } from "@/types/program";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CurrencySelector } from "@/components/CurrencySelector";
import { ProgramList } from "@/components/ProgramList";

const Activities = () => {
  const [language, setLanguage] = useState<Language>("hu");
  const [currency, setCurrency] = useState<Currency>("HUF");

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] bg-primary flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-display mb-4 text-center">
          Abod Retreat
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-center font-light">
          Fedezze fel programjainkat és töltődjön fel nálunk
        </p>
      </section>

      <div className="py-8">
        <div className="container mx-auto">
          <div className="flex justify-center gap-4 mb-8">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
            <CurrencySelector
              selectedCurrency={currency}
              onCurrencyChange={setCurrency}
            />
          </div>
          <ProgramList onLanguageChange={setLanguage} />
        </div>
      </div>
    </div>
  );
};

export default Activities;