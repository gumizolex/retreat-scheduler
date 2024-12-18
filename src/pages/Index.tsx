import { ProgramList } from "@/components/ProgramList";
import { useState } from "react";
import { motion } from "framer-motion";
import { Language } from "@/types/program";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-secondary/20">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-center">
          <motion.img 
            src="/abod-logo-dark.png" 
            alt="Abod Retreat"
            className="h-12 hover:scale-105 transition-transform duration-300"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const text = document.createElement('h1');
              text.className = 'text-2xl font-display font-bold';
              text.textContent = 'Abod Retreat';
              e.currentTarget.parentNode?.insertBefore(text, e.currentTarget);
            }}
          />
        </div>
      </header>
      
      <main className="relative">
        <div className="bg-gradient-to-br from-primary to-primary/80 py-12 px-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto text-center"
          >
            <motion.p 
              className="text-lg md:text-xl max-w-2xl mx-auto text-white/90 font-light px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {translations[language].subtitle}
            </motion.p>
          </motion.div>
        </div>
        
        <div className="container mx-auto px-4">
          <ProgramList onLanguageChange={setLanguage} />
        </div>
      </main>
      
      <footer className="bg-accent mt-16 py-8 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto text-center"
        >
          <img 
            src="/abod-logo-dark.png" 
            alt="Abod Retreat"
            className="h-12 mx-auto mb-4 opacity-80 hover:opacity-100 transition-opacity duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const text = document.createElement('h2');
              text.className = 'text-xl font-display font-bold mb-3';
              text.textContent = 'Abod Retreat';
              e.currentTarget.parentNode?.insertBefore(text, e.currentTarget);
            }}
          />
          <p className="text-accent-foreground/80 text-sm">{translations[language].copyright}</p>
        </motion.div>
      </footer>
    </div>
  );
}

export default Index;