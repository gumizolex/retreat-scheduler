import { useState } from "react";
import { ProgramList } from "@/components/ProgramList";
import { Language, Currency } from "@/types/program";
import { ProgramHeader } from "@/components/programs/ProgramHeader";
import { motion } from "framer-motion";

const translations = {
  hu: {
    title: "Abod Retreat",
    subtitle: "Fedezze fel programjainkat és élje át a nyugalom pillanatait Erdélyben"
  },
  en: {
    title: "Abod Retreat",
    subtitle: "Discover our programs and experience moments of tranquility in Transylvania"
  },
  ro: {
    title: "Abod Retreat",
    subtitle: "Descoperiți programele noastre și trăiți momente de liniște în Transilvania"
  }
};

export default function Activities() {
  const [language, setLanguage] = useState<Language>("hu");
  const [currency, setCurrency] = useState<Currency>("HUF");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-primary/5 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="relative py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-4xl mx-auto px-4"
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

      {/* Program Header with Selectors */}
      <ProgramHeader
        pageTitle="Programjaink"
        language={language}
        currency={currency}
        onLanguageChange={setLanguage}
        onCurrencyChange={setCurrency}
      />

      {/* Program List */}
      <ProgramList />
    </div>
  );
}