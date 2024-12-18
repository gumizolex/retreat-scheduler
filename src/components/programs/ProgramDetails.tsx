import { Clock, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface ProgramDetailsProps {
  duration: string;
  location: string;
  timesAvailableText: string;
}

export function ProgramDetails({ duration, location, timesAvailableText }: ProgramDetailsProps) {
  return (
    <div className="space-y-2 text-sm">
      <motion.div 
        className="flex items-center gap-2 text-accent/70"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <Clock className="w-4 h-4" />
        <span>{duration}</span>
      </motion.div>
      <motion.div 
        className="flex items-center gap-2 text-accent/70"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <MapPin className="w-4 h-4" />
        <span>{location}</span>
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
  );
}