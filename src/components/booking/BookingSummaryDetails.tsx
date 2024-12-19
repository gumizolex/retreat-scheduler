import { motion } from "framer-motion";
import { format } from "date-fns";
import { hu, enUS, ro } from "date-fns/locale";
import { Language } from "@/types/program";

const locales = {
  hu,
  en: enUS,
  ro,
};

interface BookingSummaryDetailsProps {
  formData: {
    name: string;
    date: Date;
    time: string;
    numberOfPeople: number;
  };
  programTitle: string;
  language: Language;
  t: any;
}

export function BookingSummaryDetails({ 
  formData, 
  programTitle,
  language,
  t 
}: BookingSummaryDetailsProps) {
  const { name, date, time, numberOfPeople } = formData;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 mb-6"
    >
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="font-medium text-lg text-accent mb-4">
          {t.bookingDetails}
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t.program}</span>
            <span className="font-medium text-accent">{programTitle}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t.name}</span>
            <span className="font-medium text-accent">{name}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t.date}</span>
            <span className="font-medium text-accent">
              {format(date, 'PPP', { locale: locales[language] })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t.time}</span>
            <span className="font-medium text-accent">{time}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t.numberOfPeople}</span>
            <span className="font-medium text-accent">{numberOfPeople}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}