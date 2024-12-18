import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Program, TranslatedProgram, Currency } from "@/types/program";
import { formatCurrency } from "@/utils/currency";
import { motion, useAnimation } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <div className="relative perspective-1200">
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
        transition={{ duration: 0.3 }}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: -150, right: 150 }}
        onDragStart={() => setDragStarted(true)}
        onDragEnd={(e, info) => {
          setDragStarted(false);
          if (Math.abs(info.offset.x) > 100) {
            const element = e.target as HTMLElement;
            const carousel = element.closest('.embla');
            if (carousel) {
              controls.start({
                x: info.offset.x > 0 ? 300 : -300,
                opacity: 0,
                rotateY: info.offset.x > 0 ? 15 : -15,
                scale: 0.9,
                transition: { duration: 0.4, ease: "easeOut" }
              }).then(() => {
                if (info.offset.x > 0) {
                  carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                } else {
                  carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                }
              });
            }
          } else {
            controls.start({ 
              x: 0, 
              opacity: 1,
              rotateY: 0,
              scale: 1,
              transition: { 
                type: "spring",
                stiffness: 200,
                damping: 20
              }
            });
          }
        }}
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1200px"
        }}
        whileDrag={{
          scale: 0.98,
          rotateY: dragStarted ? 0 : [-2, 2],
          transition: { 
            duration: 0.2,
            rotateY: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1
            }
          }
        }}
        className="rounded-2xl overflow-hidden"
      >
        <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-xl rounded-2xl min-h-[520px]">
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
          <CardContent className="p-6">
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
          <CardFooter className="p-6 pt-0 flex justify-between items-center border-t border-gray-100 mt-4">
            <span className="text-lg font-semibold text-primary">
              {formatCurrency(program.price, currency)}/fő
            </span>
            <Button 
              variant="default"
              onClick={() => onBook(program.id)}
              className="bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-lg"
            >
              {bookButtonText}
            </Button>
          </CardFooter>
          
          {isMobile && (
            <SwipeIndicator language={language} />
          )}
        </Card>
      </motion.div>
    </div>
  );
}