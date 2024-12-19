import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Program, TranslatedProgram, Currency } from "@/types/program";
import { formatCurrency } from "@/utils/currency";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRef } from "react";
import { ProgramDetails } from "./programs/ProgramDetails";
import { SwipeIndicator } from "./programs/SwipeIndicator";
import { useCardAnimation } from "./programs/useCardAnimation";

interface ProgramCardProps {
  program: Program;
  translatedProgram: TranslatedProgram;
  timesAvailableText: string;
  bookButtonText: string;
  onBook: (programId: number, price: number) => void;
  currency: Currency;
  language: string;
  isCentered?: boolean;
}

export function ProgramCard({
  program,
  translatedProgram,
  timesAvailableText,
  bookButtonText,
  onBook,
  currency,
  language,
  isCentered = false
}: ProgramCardProps) {
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const { controls, dragStarted, handleDragStart, handleDrag, handleDragEnd } = useCardAnimation(cardRef);

  const mobileCardVariants = {
    normal: {
      scale: 1,
      y: 0,
      rotateY: 0,
      zIndex: 0,
      transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 }
    },
    centered: {
      scale: 1.02,
      y: -5,
      rotateY: 0,
      zIndex: 10,
      transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const desktopCardVariants = {
    initial: { 
      scale: 0.95,
      opacity: 0.8,
      y: 10,
      boxShadow: "0px 0px 0px rgba(0,0,0,0)",
      transition: { duration: 0 }
    },
    hover: { 
      scale: 1.02,
      opacity: 1,
      y: -5,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.3
      }
    },
    tap: { 
      scale: 0.98,
      opacity: 0.9,
      boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.3
      }
    }
  };

  return (
    <div className="relative perspective-1200" ref={cardRef}>
      <AnimatePresence>
        <motion.div
          initial={isMobile ? "normal" : "initial"}
          animate={isMobile ? (isCentered ? "centered" : "normal") : "initial"}
          variants={isMobile ? mobileCardVariants : desktopCardVariants}
          whileHover={!isMobile ? "hover" : undefined}
          whileTap={!isMobile ? "tap" : undefined}
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: -20, right: 20 }}
          dragElastic={0.05}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{ 
            transformStyle: "preserve-3d",
            perspective: "1200px"
          }}
          className="rounded-2xl overflow-hidden touch-pan-y transform-gpu backface-hidden"
          whileDrag={{
            rotateY: -15,
            scale: 1.02,
            zIndex: 20,
            transition: { duration: 0.1 }
          }}
        >
          <Card className={`
            group relative overflow-hidden bg-white/90 backdrop-blur-sm 
            border border-gray-100
            min-h-[480px] sm:min-h-[520px] flex flex-col
            ${isCentered && isMobile ? 'shadow-lg border-primary/20' : 'hover:shadow-lg hover:border-primary/20'}
            preserve-3d backface-hidden
          `}>
            <CardHeader className="p-0">
              <div className="relative overflow-hidden aspect-video rounded-t-2xl">
                <motion.img
                  src={program.image}
                  alt={translatedProgram.title}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: (isMobile && isCentered) ? 1.05 : 1,
                    transition: { duration: 0.6, ease: "easeInOut" }
                  }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                  animate={{
                    opacity: (isMobile && isCentered) ? 0.6 : 0,
                    transition: { duration: 0.6, ease: "easeInOut" }
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex-grow">
              <CardTitle className="text-lg sm:text-xl mb-2 sm:mb-3 font-display text-accent group-hover:text-primary transition-colors duration-300">
                {translatedProgram.title}
              </CardTitle>
              <CardDescription className="mb-3 sm:mb-4 line-clamp-3 text-accent/80 text-sm sm:text-base">
                {translatedProgram.description}
              </CardDescription>
              <ProgramDetails
                duration={program.duration}
                location={program.location}
                timesAvailableText={timesAvailableText}
              />
            </CardContent>
            <CardFooter className="p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 border-t border-gray-100">
              <span className="text-base sm:text-lg font-semibold text-primary">
                {formatCurrency(program.price, currency)}/fő
              </span>
              <Button 
                variant="default"
                onClick={() => onBook(program.id, program.price)}
                className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-lg text-sm sm:text-base py-2 sm:py-3"
              >
                {bookButtonText}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}