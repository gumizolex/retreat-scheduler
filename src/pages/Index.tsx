import { ProgramList } from "@/components/ProgramList";
import { useState } from "react";

const translations = {
  en: {
    title: "Abod Retreat",
    subtitle: "Discover our unique programs and experiences in the heart of Transylvania"
  },
  hu: {
    title: "Abod Retreat",
    subtitle: "Fedezze fel egyedülálló programjainkat és élményeinket Erdély szívében"
  },
  ro: {
    title: "Abod Retreat",
    subtitle: "Descoperiți programele și experiențele noastre unice în inima Transilvaniei"
  }
};

const Index = () => {
  const [language, setLanguage] = useState("hu");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-display font-bold mb-4">
            {translations[language].title}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {translations[language].subtitle}
          </p>
        </div>
      </header>
      <main>
        <ProgramList onLanguageChange={setLanguage} />
      </main>
      <footer className="bg-accent text-accent-foreground py-8 mt-16">
        <div className="container mx-auto text-center">
          <p>© 2024 Abod Retreat. Minden jog fenntartva.</p>
        </div>
      </footer>
    </div>
  );
}

export default Index;