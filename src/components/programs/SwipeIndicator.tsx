import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface SwipeIndicatorProps {
  language: string;
}

export function SwipeIndicator({ language }: SwipeIndicatorProps) {
  const text = {
    en: "Swipe",
    hu: "Húzd",
    ro: "Glisați"
  }[language];

  const leftChevrons = [0, 1, 2];
  const rightChevrons = [0, 1, 2];

  return (
    <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
      <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-wide text-primary bg-white/80 py-2 rounded-full px-6 shadow-app">
        <div className="flex">
          {leftChevrons.map((index) => (
            <motion.div
              key={`left-${index}`}
              animate={{
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            >
              <ChevronLeft className="w-4 h-4 text-primary" />
            </motion.div>
          ))}
        </div>
        <span className="font-semibold px-2">{text}</span>
        <div className="flex">
          {rightChevrons.map((index) => (
            <motion.div
              key={`right-${index}`}
              animate={{
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            >
              <ChevronRight className="w-4 h-4 text-primary" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}