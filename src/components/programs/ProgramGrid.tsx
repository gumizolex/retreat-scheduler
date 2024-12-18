import { ProgramCard } from "../ProgramCard";
import { Language, Currency, Program, Translations } from "@/types/program";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SwipeIndicator } from "./SwipeIndicator";

interface ProgramGridProps {
  programs: Program[];
  translations: Record<Language, Translations>;
  language: Language;
  currency: Currency;
  onBookProgram: (programId: number) => void;
}

export function ProgramGrid({
  programs,
  translations,
  language,
  currency,
  onBookProgram,
}: ProgramGridProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-screen -mx-8 sm:-mx-12 lg:-mx-16">
        <div className="relative pb-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
              dragFree: false,
              containScroll: "trimSnaps",
              startIndex: 0,
            }}
            className="w-full relative overflow-visible px-4"
          >
            <CarouselContent className="-ml-8">
              {programs.map((program) => {
                const translatedProgram = translations[language].programs.find(
                  (p) => p.id === program.id
                )!;
                return (
                  <CarouselItem
                    key={program.id}
                    className="pl-8 min-w-[280px] max-w-[340px] md:min-w-[320px] md:max-w-[380px] flex-shrink-0"
                  >
                    <div className="w-full">
                      <ProgramCard
                        program={program}
                        translatedProgram={translatedProgram}
                        timesAvailableText={translations[language].timesAvailable}
                        bookButtonText={translations[language].bookButton}
                        onBook={onBookProgram}
                        currency={currency}
                        language={language}
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden" />
            <CarouselNext className="hidden" />
          </Carousel>
          {isMobile && <SwipeIndicator language={language} />}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {programs.map((program) => {
        const translatedProgram = translations[language].programs.find(
          (p) => p.id === program.id
        )!;
        return (
          <ProgramCard
            key={program.id}
            program={program}
            translatedProgram={translatedProgram}
            timesAvailableText={translations[language].timesAvailable}
            bookButtonText={translations[language].bookButton}
            onBook={onBookProgram}
            currency={currency}
            language={language}
          />
        );
      })}
    </div>
  );
}