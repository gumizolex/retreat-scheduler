import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <Select value={currentLanguage} onValueChange={(value: Language) => onLanguageChange(value)}>
      <SelectTrigger className="w-[140px] bg-white">
        <SelectValue placeholder="Select language">
          {languages[currentLanguage]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        {(Object.keys(languages) as Language[]).map((lang) => (
          <SelectItem
            key={lang}
            value={lang}
            className="cursor-pointer hover:bg-gray-100"
          >
            {languages[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}