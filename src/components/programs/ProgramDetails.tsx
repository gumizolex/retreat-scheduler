import { Clock, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Language } from "@/types/program";

interface ProgramDetailsProps {
  duration: string;
  location: string;
  timesAvailableText: string;
  language: Language;
  translations: Record<Language, {
    duration: string;
    location: string;
    timesAvailable: string;
  }>;
}

export function ProgramDetails({ 
  duration, 
  location, 
  timesAvailableText,
  language,
  translations
}: ProgramDetailsProps) {
  return (
    <div className="space-y-2 text-sm">
      <motion.div 
        className="flex items-center gap-2 text-accent/70"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <Clock className="w-4 h-4" />
        <span>{translations[language].duration}: {duration}</span>
      </motion.div>
      <motion.div 
        className="flex items-center gap-2 text-accent/70"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <MapPin className="w-4 h-4" />
        <span>{translations[language].location}: {location}</span>
      </motion.div>
      <motion.div 
        className="flex items-center gap-2 text-accent/70"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <Calendar className="w-4 h-4" />
        <span>{translations[language].timesAvailable}</span>
      </motion.div>
    </div>
  );
}