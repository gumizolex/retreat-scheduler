import { useState } from "react";
import { BookingDialog } from "./booking/BookingDialog";
import { Program, TranslatedProgram, Language, Currency } from "@/types/program";

interface ProgramCardProps {
  program: Program;
  translatedProgram: TranslatedProgram;
  timesAvailableText: string;
  bookButtonText: string;
  onBook: (programId: number) => void;
  currency: Currency;
  language: Language;
  isCentered?: boolean;
}

export function ProgramCard({ 
  program,
  translatedProgram,
  timesAvailableText,
  bookButtonText,
  onBook,
  currency,
  language,
  isCentered
}: ProgramCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className={`program-card ${isCentered ? 'centered' : ''}`}>
      <h2>{translatedProgram.title}</h2>
      <p>{program.price} {currency}</p>
      <button onClick={() => setIsBookingOpen(true)}>{bookButtonText}</button>

      {isBookingOpen && (
        <BookingDialog
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          programTitle={translatedProgram.title}
          pricePerPerson={program.price}
          currency={currency}
          language={language}
        />
      )}
    </div>
  );
}