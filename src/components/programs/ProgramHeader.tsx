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
    <div className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm" />
      
      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Language and Currency Selectors */}
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

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-accent tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {translations[language].title}
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-xl sm:text-2xl md:text-3xl text-accent/80 font-display max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {translations[language].subtitle}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}