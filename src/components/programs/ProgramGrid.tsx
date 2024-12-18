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
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full relative overflow-visible px-4"
        >
          <CarouselContent className="-ml-4">
            {programs.map((program) => {
              const translatedProgram = translations[language].programs.find(
                (p) => p.id === program.id
              )!;
              return (
                <CarouselItem
                  key={program.id}
                  className="pl-4 basis-[75%] md:basis-[70%] first:pl-0"
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
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/95 via-white/50 to-transparent pointer-events-none z-10 flex flex-col items-start justify-center gap-2 pl-4">
            <ChevronLeft className="w-5 h-5 text-primary/40 animate-[pulse_2s_ease-in-out_infinite]" />
            <ChevronLeft className="w-5 h-5 text-primary/60 animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
            <ChevronLeft className="w-5 h-5 text-primary/80 animate-[pulse_2s_ease-in-out_infinite_0.6s]" />
          </div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/95 via-white/50 to-transparent pointer-events-none z-10 flex flex-col items-end justify-center gap-2 pr-4">
            <ChevronRight className="w-5 h-5 text-primary/40 animate-[pulse_2s_ease-in-out_infinite]" />
            <ChevronRight className="w-5 h-5 text-primary/60 animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
            <ChevronRight className="w-5 h-5 text-primary/80 animate-[pulse_2s_ease-in-out_infinite_0.6s]" />
          </div>
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