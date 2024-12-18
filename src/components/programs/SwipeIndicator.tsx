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
      className="flex items-center justify-center gap-2 text-xs font-medium tracking-wide text-primary pointer-events-none bg-white/80 py-2 rounded-full"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        scale: [1, 1.05, 1],
        transition: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }
      }}
    >
      <div className="flex gap-1">
        <ChevronLeft className="w-4 h-4 text-primary" />
        <ChevronLeft className="w-4 h-4 text-primary" />
        <ChevronLeft className="w-4 h-4 text-primary" />
      </div>
      <span className="font-semibold">{text}</span>
      <div className="flex gap-1">
        <ChevronRight className="w-4 h-4 text-primary" />
        <ChevronRight className="w-4 h-4 text-primary" />
        <ChevronRight className="w-4 h-4 text-primary" />
      </div>
    </motion.div>
  );
}