import { LanguageSelector } from "../LanguageSelector";
import { CurrencySelector } from "../CurrencySelector";
import { Language, Currency } from "@/types/program";
import { motion } from "framer-motion";

interface ProgramHeaderProps {
  pageTitle: string;
  language: Language;
  currency: Currency;
  onLanguageChange: (lang: Language) => void;
  onCurrencyChange: (currency: Currency) => void;
}

const translations = {
  hu: {
    title: "Abod Retreat",
    subtitle: "Fedezze fel programjainkat és élje át a nyugalom pillanatait"
  },
  en: {
    title: "Abod Retreat",
    subtitle: "Discover our programs and experience moments of tranquility"
  },
  ro: {
    title: "Abod Retreat",
    subtitle: "Descoperiți programele noastre și trăiți momente de liniște"
  }
};

export function ProgramHeader({
  language,
  currency,
  onLanguageChange,
  onCurrencyChange,
}: ProgramHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 px-4 py-32 bg-primary/20"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-accent mb-8 tracking-tight">
          {translations[language].title}
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-accent/90 font-display max-w-4xl mx-auto leading-relaxed">
          {translations[language].subtitle}
        </p>
      </motion.div>

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
    </div>
  );
}