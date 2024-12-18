import { Button } from "@/components/ui/button";
import { Language } from "@/types/program";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex justify-end mb-4 gap-2">
      <Button
        variant={currentLanguage === "hu" ? "default" : "outline"}
        onClick={() => onLanguageChange("hu")}
      >
        Magyar
      </Button>
      <Button
        variant={currentLanguage === "en" ? "default" : "outline"}
        onClick={() => onLanguageChange("en")}
      >
        English
      </Button>
      <Button
        variant={currentLanguage === "ro" ? "default" : "outline"}
        onClick={() => onLanguageChange("ro")}
      >
        Română
      </Button>
    </div>
  );
}