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

  const leftChevrons = [0, 1, 2];  // Changed order for correct animation flow
  const rightChevrons = [0, 1, 2];

  return (
    <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
      <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-wide text-primary py-2 px-6">
        <div className="flex">
          {leftChevrons.map((index) => (
            <motion.div
              key={`left-${index}`}
              animate={{
                opacity: [0.2, 1, 0.2],
                x: [2, 0, 2], // Added x animation for left movement
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
                x: [-2, 0, -2], // Added x animation for right movement
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