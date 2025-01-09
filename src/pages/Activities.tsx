import { ProgramList } from "@/components/ProgramList";
import { Language, Currency } from "@/types/program";
import { motion } from "framer-motion";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CurrencySelector } from "@/components/CurrencySelector";

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

            <div className="flex justify-center gap-4 pt-8">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              <CurrencySelector
                selectedCurrency={currency}
                onCurrencyChange={setCurrency}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Program List */}
      <ProgramList />
    </div>
  );
}