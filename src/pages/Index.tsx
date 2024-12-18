import { useState } from "react";
import { motion } from "framer-motion";
import { Language } from "@/types/program";
import { ProgramList } from "@/components/ProgramList";
import { LanguageSelector } from "@/components/LanguageSelector";

const translations = {
  en: {
    subtitle: "Discover our unique programs and experiences in the heart of Transylvania",
    copyright: "© 2024 Abod Retreat. All rights reserved."
  },
  hu: {
    subtitle: "Fedezze fel egyedülálló programjainkat és élményeinket Erdély szívében",
    copyright: "© 2024 Abod Retreat. Minden jog fenntartva."
  },
  ro: {
    subtitle: "Descoperiți programele și experiențele noastre unice în inima Transilvaniei",
    copyright: "© 2024 Abod Retreat. Toate drepturile rezervate."
  }
};

const Index = () => {
  const [language, setLanguage] = useState<Language>("hu");

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-secondary/20">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 shadow-sm">
        <div className="container mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
          <motion.img 
            src="/abod-logo-dark.png" 
            alt="Abod Retreat"
            className="h-12 sm:h-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
          <LanguageSelector 
            currentLanguage={language} 
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </header>
      
      <main className="relative">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-accent mb-6">
                Abod Retreat
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8">
                {translations[language].subtitle}
              </p>
            </motion.div>
          </div>

          <ProgramList onLanguageChange={handleLanguageChange} />
        </div>
      </main>
      
      <footer className="bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          {translations[language].copyright}
        </div>
      </footer>
    </div>
  );
};

export default Index;