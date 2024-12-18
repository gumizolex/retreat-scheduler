import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function SwipeIndicator() {
  return (
    <motion.div
      className="flex items-center justify-center gap-2"
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
      <span>Húzd jobbra vagy balra</span>
      <div className="flex gap-1">
        <ChevronRight className="w-4 h-4 text-primary/40 animate-[pulse_2s_ease-in-out_infinite]" />
        <ChevronRight className="w-4 h-4 text-primary/60 animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
        <ChevronRight className="w-4 h-4 text-primary/80 animate-[pulse_2s_ease-in-out_infinite_0.6s]" />
      </div>
    </motion.div>
  );
}