import { ProgramCard } from "../ProgramCard";
import { Language, Currency, Program, Translations } from "@/types/program";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { SwipeIndicator } from "./SwipeIndicator";
import { useState } from "react";

interface ProgramGridProps {
  programs: Program[];
  translations: Record<Language, Translations>;
  language: Language;
  currency: Currency;
  onBookProgram: (programId: number, price: number) => void;
}

export function ProgramGrid({
  programs,
  translations,
  language,
  currency,
  onBookProgram,
}: ProgramGridProps) {
  const isMobile = useIsMobile();
  const [centerIndex, setCenterIndex] = useState(0);

  console.log('ProgramGrid render:', { programs, language, currency });

  const handleScroll = (element: HTMLElement) => {
    const cards = Array.from(element.querySelectorAll('.embla__slide'));
    const containerRect = element.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let closestIndex = 0;
    let minDistance = Infinity;
    
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    setCenterIndex(closestIndex);
  };

  if (isMobile) {
    return (
      <div className="w-screen -mx-8 sm:-mx-12 lg:-mx-16">
        <div className="relative pb-16">
          <Carousel
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
              dragFree: false,
              containScroll: "trimSnaps",
              startIndex: 0,
            }}
            className="w-full relative overflow-visible px-8"
            onScroll={(e) => handleScroll(e.target as HTMLElement)}
          >
            <CarouselContent className="-ml-8">
              {programs.map((program, index) => {
                const translatedProgram = translations[language].programs.find(
                  (p) => p.id === program.id
                )!;
                return (
                  <CarouselItem
                    key={program.id}
                    className="pl-8 basis-[85%] md:basis-[45%] lg:basis-[33%] snap-center"
                  >
                    <div className="w-full h-full">
                      <ProgramCard
                        program={program}
                        translatedProgram={translatedProgram}
                        timesAvailableText={translations[language].timesAvailable}
                        bookButtonText={translations[language].bookButton}
                        onBook={onBookProgram}
                        currency={currency}
                        language={language}
                        translations={{
                          hu: {
                            duration: translations.hu.duration,
                            location: translations.hu.location,
                            timesAvailable: translations.hu.timesAvailable
                          },
                          en: {
                            duration: translations.en.duration,
                            location: translations.en.location,
                            timesAvailable: translations.en.timesAvailable
                          },
                          ro: {
                            duration: translations.ro.duration,
                            location: translations.ro.location,
                            timesAvailable: translations.ro.timesAvailable
                          }
                        }}
                        isCentered={index === centerIndex}
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
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
            translations={{
              hu: {
                duration: translations.hu.duration,
                location: translations.hu.location,
                timesAvailable: translations.hu.timesAvailable
              },
              en: {
                duration: translations.en.duration,
                location: translations.en.location,
                timesAvailable: translations.en.timesAvailable
              },
              ro: {
                duration: translations.ro.duration,
                location: translations.ro.location,
                timesAvailable: translations.ro.timesAvailable
              }
            }}
          />
        );
      })}
    </div>
  );
}