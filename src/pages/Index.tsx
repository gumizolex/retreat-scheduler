import { ProgramList } from "@/components/ProgramList";
import { useState } from "react";
import { motion } from "framer-motion";

const translations = {
  en: {
    subtitle: "Discover our unique programs and experiences in the heart of Transylvania"
  },
  hu: {
    subtitle: "Fedezze fel egyedülálló programjainkat és élményeinket Erdély szívében"
  },
  ro: {
    subtitle: "Descoperiți programele și experiențele noastre unice în inima Transilvaniei"
  }
};

const Index = () => {
  const [language, setLanguage] = useState("hu");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-secondary/20">
      <header className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 py-20 text-primary-foreground">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto text-center relative z-10"
        >
          <motion.img 
            src="/abod-logo-white.png" 
            alt="Abod Retreat"
            className="h-32 mx-auto mb-8 hover:scale-105 transition-transform duration-300"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const text = document.createElement('h1');
              text.className = 'text-4xl font-display font-bold mb-6';
              text.textContent = 'Abod Retreat';
              e.currentTarget.parentNode?.insertBefore(text, e.currentTarget);
            }}
          />
          <motion.p 
            className="text-xl max-w-2xl mx-auto text-white/90 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {translations[language].subtitle}
          </motion.p>
        </motion.div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
      </header>
      
      <main className="relative z-10">
        <ProgramList onLanguageChange={setLanguage} />
      </main>
      
      <footer className="bg-accent text-accent-foreground py-12 mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto text-center"
        >
          <img 
            src="/abod-logo-dark.png" 
            alt="Abod Retreat"
            className="h-16 mx-auto mb-6 opacity-80 hover:opacity-100 transition-opacity duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const text = document.createElement('h2');
              text.className = 'text-2xl font-display font-bold mb-4';
              text.textContent = 'Abod Retreat';
              e.currentTarget.parentNode?.insertBefore(text, e.currentTarget);
            }}
          />
          <p className="text-accent-foreground/80">© 2024 Abod Retreat. Minden jog fenntartva.</p>
        </motion.div>
      </footer>
    </div>
  );
}

export default Index;