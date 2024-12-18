import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface SwipeIndicatorProps {
  language: string;
}

export function SwipeIndicator({ language }: SwipeIndicatorProps) {
  const text = {
    en: "Swipe left or right",
    hu: "Húzd jobbra vagy balra",
    ro: "Glisați la stânga sau la dreapta"
  }[language];

  return (
    <motion.div
      className="flex items-center justify-center gap-2 absolute -bottom-8 left-0 right-0 text-xs font-medium tracking-wide text-primary/70 pointer-events-none"
      animate={{
        scale: [1, 1.1, 1],
        transition: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }
      }}
    >
      <div className="flex gap-1">
        <ChevronLeft className="w-4 h-4 text-primary/40 animate-[pulse_2s_ease-in-out_infinite]" />
        <ChevronLeft className="w-4 h-4 text-primary/60 animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
        <ChevronLeft className="w-4 h-4 text-primary/80 animate-[pulse_2s_ease-in-out_infinite_0.6s]" />
      </div>
      <span>{text}</span>
      <div className="flex gap-1">
        <ChevronRight className="w-4 h-4 text-primary/40 animate-[pulse_2s_ease-in-out_infinite]" />
        <ChevronRight className="w-4 h-4 text-primary/60 animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
        <ChevronRight className="w-4 h-4 text-primary/80 animate-[pulse_2s_ease-in-out_infinite_0.6s]" />
      </div>
    </motion.div>
  );
}