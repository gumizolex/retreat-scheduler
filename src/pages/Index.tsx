import { ProgramList } from "@/components/ProgramList";
import { useState } from "react";

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
    <div className="min-h-screen bg-background">
      <header className="bg-primary py-16 text-primary-foreground relative overflow-hidden">
        <div className="container mx-auto text-center">
          <img 
            src="/abod-logo-white.png" 
            alt="Abod Retreat"
            className="h-32 mx-auto mb-6"
          />
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            {translations[language].subtitle}
          </p>
        </div>
      </header>
      <main>
        <ProgramList onLanguageChange={setLanguage} />
      </main>
      <footer className="bg-accent text-accent-foreground py-8 mt-16">
        <div className="container mx-auto text-center">
          <img 
            src="/abod-logo-dark.png" 
            alt="Abod Retreat"
            className="h-16 mx-auto mb-4 opacity-80"
          />
          <p>© 2024 Abod Retreat. Minden jog fenntartva.</p>
        </div>
      </footer>
    </div>
  );
}

export default Index;