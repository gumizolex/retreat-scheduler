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
import { cn } from "@/lib/utils";

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
      <div className="w-full max-w-md mx-auto px-4">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {programs.map((program, index) => {
              const translatedProgram = translations[language].programs.find(
                (p) => p.id === program.id
              )!;
              return (
                <CarouselItem
                  key={program.id}
                  className="pl-2 md:pl-4 basis-full"
                >
                  <div className="relative">
                    <ProgramCard
                      program={program}
                      translatedProgram={translatedProgram}
                      timesAvailableText={translations[language].timesAvailable}
                      bookButtonText={translations[language].bookButton}
                      onBook={onBookProgram}
                      currency={currency}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="absolute inset-y-0 -left-4 w-12 bg-gradient-to-r from-white/80 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 -right-4 w-12 bg-gradient-to-l from-white/80 to-transparent pointer-events-none z-10" />
          <CarouselPrevious className="hidden" />
          <CarouselNext className="hidden" />
        </Carousel>
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
          />
        );
      })}
    </div>
  );
}