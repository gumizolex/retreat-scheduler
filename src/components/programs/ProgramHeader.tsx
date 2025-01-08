import { Language, Currency } from "@/types/program";
import { LanguageSelector } from "../LanguageSelector";
import { CurrencySelector } from "../CurrencySelector";

interface ProgramHeaderProps {
  pageTitle: string;
  language: Language;
  currency: Currency;
  onLanguageChange: (lang: Language) => void;
  onCurrencyChange: (currency: Currency) => void;
}

const getHeroContent = (language: Language) => {
  switch (language) {
    case "hu":
      return {
        title: "Abod Retreat",
        subtitle: "Varázslatos pihenés Erdély szívében",
        description: "Fedezze fel a nyugalom és harmónia szigetét Erdély festői tájain"
      };
    case "en":
      return {
        title: "Abod Retreat",
        subtitle: "Magical Rest in the Heart of Transylvania",
        description: "Discover an oasis of peace and harmony in the picturesque landscapes of Transylvania"
      };
    case "ro":
      return {
        title: "Abod Retreat",
        subtitle: "Odihnă magică în inima Transilvaniei",
        description: "Descoperă o oază de pace și armonie în peisajele pitorești ale Transilvaniei"
      };
    default:
      return {
        title: "Abod Retreat",
        subtitle: "Varázslatos pihenés Erdély szívében",
        description: "Fedezze fel a nyugalom és harmónia szigetét Erdély festői tájain"
      };
  }
};

export function ProgramHeader({
  language,
  currency,
  onLanguageChange,
  onCurrencyChange,
}: ProgramHeaderProps) {
  const content = getHeroContent(language);

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={onLanguageChange}
        />
        <CurrencySelector
          selectedCurrency={currency}
          onCurrencyChange={onCurrencyChange}
        />
      </div>
      
      <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 bg-gradient-to-b from-secondary/40 to-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4 text-primary animate-in fade-in slide-in-from-bottom duration-1000">
          {content.title}
        </h1>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-display text-accent/80 mb-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          {content.subtitle}
        </h2>
        <p className="max-w-2xl text-lg md:text-xl text-accent/60 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
          {content.description}
        </p>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>
    </div>
  );
}