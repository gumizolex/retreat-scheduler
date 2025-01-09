import { useState } from "react";
import { ProgramList } from "@/components/ProgramList";
import { Language, Currency } from "@/types/program";
import { motion } from "framer-motion";
import { ProgramHeader } from "@/components/programs/ProgramHeader";

const translations = {
  hu: {
    title: "Programok és Élmények",
    subtitle: "Fedezze fel egyedülálló programjainkat és élményeinket"
  },
  en: {
    title: "Programs and Experiences",
    subtitle: "Discover our unique programs and experiences"
  },
  ro: {
    title: "Programe și Experiențe",
    subtitle: "Descoperiți programele și experiențele noastre unice"
  }
};

export default function Activities() {
  const [language, setLanguage] = useState<Language>("hu");
  const [currency, setCurrency] = useState<Currency>("HUF");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <ProgramHeader
              pageTitle={translations[language].title}
              language={language}
              currency={currency}
              onLanguageChange={setLanguage}
              onCurrencyChange={setCurrency}
            />
            
            <motion.p 
              className="text-xl sm:text-2xl md:text-3xl text-accent/80 font-display max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {translations[language].subtitle}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Program List */}
      <ProgramList />
    </div>
  );
}