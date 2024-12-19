import { useState } from "react";
import { BookingDialog } from "./booking/BookingDialog";
import { Language, Currency } from "@/types/program";

interface ProgramCardProps {
  title: string;
  price: number;
  currency: Currency;
  language: Language;
}

export function ProgramCard({ title, price, currency, language }: ProgramCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="program-card">
      <h2>{title}</h2>
      <p>{price} {currency}</p>
      <button onClick={() => setIsBookingOpen(true)}>Book Now</button>

      {isBookingOpen && (
        <BookingDialog
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          programTitle={title}
          pricePerPerson={price}
          currency={currency}
          language={language}
        />
      )}
    </div>
  );
}