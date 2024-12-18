import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Program, TranslatedProgram, Currency } from "@/types/program";
import { formatCurrency } from "@/utils/currency";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProgramCardProps {
  program: Program;
  translatedProgram: TranslatedProgram;
  timesAvailableText: string;
  bookButtonText: string;
  onBook: (programId: number) => void;
  currency: Currency;
}

export function ProgramCard({
  program,
  translatedProgram,
  timesAvailableText,
  bookButtonText,
  onBook,
  currency
}: ProgramCardProps) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isMobile ? { y: -5 } : {}}
      transition={{ duration: 0.3 }}
      drag={isMobile ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        if (Math.abs(info.offset.x) > 100) {
          // Trigger next/previous slide
          const element = e.target as HTMLElement;
          const carousel = element.closest('.embla');
          if (carousel) {
            if (info.offset.x > 0) {
              carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
            } else {
              carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
            }
          }
        }
      }}
    >
      <Card className="group overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-xl">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden aspect-video">
            <img
              src={program.image}
              alt={translatedProgram.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
          <div className="space-y-2 text-sm">
            <motion.div 
              className="flex items-center gap-2 text-accent/70"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Clock className="w-4 h-4" />
              <span>{program.duration}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-accent/70"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin className="w-4 h-4" />
              <span>{program.location}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 text-accent/70"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="w-4 h-4" />
              <span>{timesAvailableText}</span>
            </motion.div>
          </div>
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
      </Card>
    </motion.div>
  );
}