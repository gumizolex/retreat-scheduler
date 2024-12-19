import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { BookingProgressSteps } from "./BookingProgressSteps";
import { BookingFormWrapper } from "./BookingFormWrapper";
import { Currency, Language } from "@/types/program";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  programTitle: string;
  pricePerPerson: number;
  currency: Currency;
  language: Language;
}

export function BookingDialog({
  isOpen,
  onClose,
  programTitle,
  pricePerPerson,
  currency,
  language
}: BookingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] w-[90vw] mx-auto p-0 overflow-hidden bg-white rounded-xl">
        <div className="relative w-full">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
          
          <BookingFormWrapper 
            programTitle={programTitle}
            pricePerPerson={pricePerPerson}
            currency={currency}
            language={language}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}