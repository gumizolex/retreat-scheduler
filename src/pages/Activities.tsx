import { useState } from "react";
import { ProgramList } from "@/components/ProgramList";
import { Language, Currency } from "@/types/program";
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
      <div className="relative bg-white">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 max-w-4xl mx-auto"
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
      <ProgramList onLanguageChange={setLanguage} />
    </div>
  );
}