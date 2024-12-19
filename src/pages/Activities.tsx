import { useState } from "react";
import { Language, Currency } from "@/types/program";
import { ProgramList } from "@/components/ProgramList";

const Activities = () => {
  const [language, setLanguage] = useState<Language>("hu");

  const heroTranslations = {
    hu: {
      title: "Abod Retreat",
      description: "Fedezze fel egyedülálló programjainkat és élményeinket Erdély szívében"
    },
    en: {
      title: "Abod Retreat",
      description: "Discover our unique programs and experiences in the heart of Transylvania"
    },
    ro: {
      title: "Abod Retreat",
      description: "Descoperiți programele și experiențele noastre unice în inima Transilvaniei"
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[40vh] bg-primary flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-display mb-4 text-center">
          {heroTranslations[language].title}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-center font-light">
          {heroTranslations[language].description}
        </p>
      </section>

      <div className="py-8">
        <div className="container mx-auto">
          <ProgramList onLanguageChange={setLanguage} />
        </div>
      </div>
    </div>
  );
};

export default Activities;