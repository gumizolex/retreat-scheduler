import { ProgramList } from "@/components/ProgramList";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CurrencySelector } from "@/components/CurrencySelector";
import { useState } from "react";
import { Language, Currency } from "@/types/program";

const Activities = () => {
  const [language, setLanguage] = useState<Language>("hu");
  const [currency, setCurrency] = useState<Currency>("HUF");

  const footerText = {
    hu: "© 2024 Abod Retreat. Minden jog fenntartva.",
    en: "© 2024 Abod Retreat. All rights reserved.",
    ro: "© 2024 Abod Retreat. Toate drepturile rezervate."
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-primary py-16 text-primary-foreground relative">
        <div className="container mx-auto px-4">
          <div className="absolute top-4 right-4 flex gap-4">
            <CurrencySelector 
              selectedCurrency={currency} 
              onCurrencyChange={setCurrency} 
            />
            <LanguageSelector 
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-8 pt-8">
            <img 
              src="/lovable-uploads/abod-logo-white.png" 
              alt="Abod Retreat Logo" 
              className="h-32 md:h-40 w-auto"
            />
            <h1 className="text-5xl font-display font-bold text-center">
              Abod Retreat
            </h1>
          </div>
        </div>
      </header>

      <main>
        <ProgramList />
      </main>

      <footer className="bg-accent text-accent-foreground py-8 mt-16">
        <div className="container mx-auto text-center">
          <p>{footerText[language]}</p>
        </div>
      </footer>
    </div>
  );
}

export default Activities;