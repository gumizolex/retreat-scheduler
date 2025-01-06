import { Language, Program, Translations } from "@/types/program";

interface TranslationsProviderProps {
  programs: Program[];
}

export const getTranslations = (programs: Program[]): Record<Language, Translations> => {
  return {
    hu: {
      pageTitle: "Programok és Élmények",
      bookButton: "Foglalás",
      timesAvailable: "Elérhető időpontok",
      duration: "Időtartam",
      location: "Helyszín",
      programs: programs?.map(program => ({
        id: program.id,
        title: program.program_translations.find(t => t.language === "hu")?.title || '',
        description: program.program_translations.find(t => t.language === "hu")?.description || '',
      })) || []
    },
    en: {
      pageTitle: "Programs and Experiences",
      bookButton: "Book Now",
      timesAvailable: "Available Times",
      duration: "Duration",
      location: "Location",
      programs: programs?.map(program => ({
        id: program.id,
        title: program.program_translations.find(t => t.language === "en")?.title || '',
        description: program.program_translations.find(t => t.language === "en")?.description || '',
      })) || []
    },
    ro: {
      pageTitle: "Programe și Experiențe",
      bookButton: "Rezervare",
      timesAvailable: "Ore disponibile",
      duration: "Durată",
      location: "Locație",
      programs: programs?.map(program => ({
        id: program.id,
        title: program.program_translations.find(t => t.language === "ro")?.title || '',
        description: program.program_translations.find(t => t.language === "ro")?.description || '',
      })) || []
    }
  };
};