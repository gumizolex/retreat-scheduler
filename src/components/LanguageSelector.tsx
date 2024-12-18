import { Button } from "@/components/ui/button";
import { Language } from "@/types/program";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const languages = {
    hu: "Magyar",
    en: "English",
    ro: "Română"
  };

  return (
    <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg">
      {(Object.keys(languages) as Language[]).map((lang) => (
        <Button
          key={lang}
          variant={currentLanguage === lang ? "default" : "ghost"}
          size="sm"
          onClick={() => onLanguageChange(lang)}
          className="transition-all duration-200"
        >
          {languages[lang]}
        </Button>
      ))}
    </div>
  );
}