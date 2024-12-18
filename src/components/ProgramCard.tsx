import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Program, TranslatedProgram, Currency } from "@/types/program";
import { formatCurrency } from "@/utils/currency";
import { motion, useAnimation } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect, useRef } from "react";
import { ProgramDetails } from "./programs/ProgramDetails";
import { SwipeIndicator } from "./programs/SwipeIndicator";

interface ProgramCardProps {
  program: Program;
  translatedProgram: TranslatedProgram;
  timesAvailableText: string;
  bookButtonText: string;
  onBook: (programId: number) => void;
  currency: Currency;
  language: string;
}

export function ProgramCard({
  program,
  translatedProgram,
  timesAvailableText,
  bookButtonText,
  onBook,
  currency,
  language
}: ProgramCardProps) {
  const isMobile = useIsMobile();
  const controls = useAnimation();
  const [dragStarted, setDragStarted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, x: 0 });
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setInitialPosition({ x: rect.left, y: rect.top });
    }
  }, [controls]);

  const checkCollision = (element: HTMLElement) => {
    const rect1 = element.getBoundingClientRect();
    const siblings = Array.from(element.parentElement?.children || [])
      .filter(child => child !== element && child instanceof HTMLElement) as HTMLElement[];
    
    return siblings.some(sibling => {
      const rect2 = sibling.getBoundingClientRect();
      return !(
        rect1.right < rect2.left || 
        rect1.left > rect2.right || 
        rect1.bottom < rect2.top || 
        rect1.top > rect2.bottom
      );
    });
  };

  const resetPosition = () => {
    controls.start({ 
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1
      }
    });
  };

  return (
    <div className="relative perspective-1200" ref={cardRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        whileHover={!isMobile ? { 
          y: -5,
          rotateY: [-1, 1],
          transition: {
            rotateY: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2
            }
          }
        } : {}}
        transition={{ 
          duration: 0.4,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.1}
        onDragStart={() => setDragStarted(true)}
        onDrag={(event, info) => {
          if (cardRef.current && checkCollision(cardRef.current)) {
            resetPosition();
          }
        }}
        onDragEnd={(e, info) => {
          setDragStarted(false);
          const element = e.target as HTMLElement;
          
          if (cardRef.current && checkCollision(cardRef.current)) {
            resetPosition();
            return;
          }

          if (Math.abs(info.offset.x) > 50) {
            const carousel = element.closest('.embla');
            if (carousel) {
              controls.start({
                x: info.offset.x > 0 ? 200 : -200,
                opacity: 0.5,
                transition: { 
                  duration: 0.3,
                  ease: "easeOut"
                }
              }).then(() => {
                if (info.offset.x > 0) {
                  carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                } else {
                  carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                }
                controls.start({ 
                  x: 0, 
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut"
                  }
                });
              });
            }
          } else {
            resetPosition();
          }
        }}
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1200px"
        }}
        whileDrag={{
          scale: 0.98,
          transition: { 
            duration: 0.3,
            ease: "easeOut"
          }
        }}
        className="rounded-2xl overflow-hidden touch-pan-y"
      >
        <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-xl rounded-2xl min-h-[520px] flex flex-col">
          {isMobile && !dragStarted && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.3, 0, 0.3],
                x: ["-100%", "100%", "-100%"],
                transition: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }
              }}
            />
          )}
          
          <CardHeader className="p-0">
            <div className="relative overflow-hidden aspect-video rounded-t-2xl">
              <img
                src={program.image}
                alt={translatedProgram.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-grow">
            <CardTitle className="text-xl mb-3 font-display text-accent group-hover:text-primary transition-colors duration-300">
              {translatedProgram.title}
            </CardTitle>
            <CardDescription className="mb-4 line-clamp-3 text-accent/80">
              {translatedProgram.description}
            </CardDescription>
            <ProgramDetails
              duration={program.duration}
              location={program.location}
              timesAvailableText={timesAvailableText}
            />
          </CardContent>
          <CardFooter className="p-6 flex flex-col items-center gap-3 border-t border-gray-100">
            <span className="text-lg font-semibold text-primary">
              {formatCurrency(program.price, currency)}/fő
            </span>
            <Button 
              variant="default"
              onClick={() => onBook(program.id)}
              className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-lg"
            >
              {bookButtonText}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}