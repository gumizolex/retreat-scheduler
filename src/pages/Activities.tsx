import { useState } from "react";
import { Language } from "@/types/program";
import { ProgramList } from "@/components/ProgramList";
import { useToast } from "@/components/ui/use-toast";

const Activities = () => {
  const [language, setLanguage] = useState<Language>("hu");
  const { toast } = useToast();

  const heroTranslations = {
    hu: {
      title: "Abod Retreat",
      description: "Fedezze fel egyedülálló programjainkat és élményeinket Erdély szívében",
      copyright: "Minden jog fenntartva"
    },
    en: {
      title: "Abod Retreat",
      description: "Discover our unique programs and experiences in the heart of Transylvania",
      copyright: "All rights reserved"
    },
    ro: {
      title: "Abod Retreat",
      description: "Descoperiți programele și experiențele noastre unice în inima Transilvaniei",
      copyright: "Toate drepturile rezervate"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative h-[40vh] bg-primary flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-display mb-4 text-center">
          {heroTranslations[language].title}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-center font-light">
          {heroTranslations[language].description}
        </p>
      </section>

      <main className="flex-grow">
        <ProgramList onLanguageChange={setLanguage} />
      </main>

      <footer className="py-4 text-center text-sm text-muted-foreground">
        © 2024 Abod Retreat - {heroTranslations[language].copyright}
      </footer>
    </div>
  );
};

export default Activities;