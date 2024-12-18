import { LanguageSelector } from "../LanguageSelector";
import { CurrencySelector } from "../CurrencySelector";
import { Language, Currency } from "@/types/program";

interface ProgramHeaderProps {
  pageTitle: string;
  language: Language;
  currency: Currency;
  onLanguageChange: (lang: Language) => void;
  onCurrencyChange: (currency: Currency) => void;
}

export function ProgramHeader({
  pageTitle,
  language,
  currency,
  onLanguageChange,
  onCurrencyChange,
}: ProgramHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-row justify-center items-center gap-4 mb-12">
        <CurrencySelector 
          selectedCurrency={currency} 
          onCurrencyChange={onCurrencyChange} 
        />
        <LanguageSelector 
          currentLanguage={language}
          onLanguageChange={onLanguageChange}
        />
      </div>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-accent mb-8 md:mb-12 text-center px-4">
        {pageTitle}
      </h1>
    </div>
  );
}