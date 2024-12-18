import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StepProps {
  icon: LucideIcon;
  title: string;
  isActive: boolean;
  isLast?: boolean;
}

export function BookingProgressSteps({ steps, currentStep }: { 
  steps: { icon: LucideIcon; title: string }[];
  currentStep: number;
}) {
  return (
    <div className="container py-4">
      <div className="flex justify-between items-center relative max-w-[80%] mx-auto">
        {steps.map((s, idx) => (
          <Step
            key={idx}
            icon={s.icon}
            title={s.title}
            isActive={idx === currentStep}
            isLast={idx === steps.length - 1}
          />
        ))}
        <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200 -z-10" />
      </div>
    </div>
  );
}

function Step({ icon: Icon, title, isActive, isLast }: StepProps) {
  return (
    <div className="flex flex-col items-center relative bg-white">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: isActive ? 1 : 0.8 }}
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isActive ? 'bg-primary text-white' : 'bg-gray-100'
        }`}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <span className={`text-sm mt-1 ${
        isActive ? 'text-primary font-medium' : 'text-gray-500'
      }`}>
        {title}
      </span>
    </div>
  );
}