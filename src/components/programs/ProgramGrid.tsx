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
import { useState } from "react";

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
  const [centerIndex, setCenterIndex] = useState(0);

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
                const translatedTitle = translations[language].programs.find(
                  (p) => p.id === program.id
                )?.title || "";
                return (
                  <CarouselItem
                    key={program.id}
                    className="pl-8 basis-[85%] md:basis-[45%] lg:basis-[33%] snap-center"
                  >
                    <div className="w-full h-full">
                      <ProgramCard
                        title={translatedTitle}
                        price={program.price}
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
        const translatedTitle = translations[language].programs.find(
          (p) => p.id === program.id
        )?.title || "";
        return (
          <ProgramCard
            key={program.id}
            title={translatedTitle}
            price={program.price}
            currency={currency}
            language={language}
          />
        );
      })}
    </div>
  );
}