import { useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CurrencySelector } from "@/components/CurrencySelector";
import { ProgramList } from "@/components/ProgramList";
import { Language, Currency } from "@/types/program";

const Activities = () => {
  const [language, setLanguage] = useState<Language>("hu");
  const [currency, setCurrency] = useState<Currency>("HUF");

  return (
    <div className="min-h-screen">
      <section className="relative h-screen bg-primary flex flex-col items-center justify-center text-white px-4">
        <img
          src="/abod-logo-white.png"
          alt="Abod Retreat Logo"
          className="w-auto h-16 mb-12"
        />
        <h1 className="text-6xl font-display mb-8 text-center">
          Abod Retreat
        </h1>
        <p className="text-2xl text-center max-w-3xl">
          Fedezze fel egyedülálló programjainkat és élményeinket Erdély szívében
        </p>
      </section>

      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end gap-4 mb-8">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
            <CurrencySelector
              selectedCurrency={currency}
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