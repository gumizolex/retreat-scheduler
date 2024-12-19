import { LanguageSelector } from "@/components/LanguageSelector";
import { CurrencySelector } from "@/components/CurrencySelector";
import { useState } from "react";
import { Language, Currency } from "@/types/program";
import { ProgramList } from "@/components/ProgramList";

const Activities = () => {
  const [language, setLanguage] = useState<Language>("hu");
  const [currency, setCurrency] = useState<Currency>("HUF");

  return (
    <div className="min-h-screen bg-background">
      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end gap-4 mb-8">
            <LanguageSelector
              language={language}
              onLanguageChange={setLanguage}
            />
            <CurrencySelector
              currency={currency}
              onCurrencyChange={setCurrency}
            />
          </div>
          <ProgramList />
        </div>
      </main>
    </div>
  );
};

export default Activities;