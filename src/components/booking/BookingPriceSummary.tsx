import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Currency } from "@/types/program";
import { formatCurrency } from "@/utils/currency";

interface BookingPriceSummaryProps {
  totalPrice: number;
  pricePerPerson: number;
  currency: Currency;
  t: any;
  onSubmit: () => void;
}

export function BookingPriceSummary({ totalPrice, pricePerPerson, currency, t, onSubmit }: BookingPriceSummaryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="pt-6 border-t"
    >
      <div className="text-xl font-semibold text-accent mb-6">
        {t.total}: {formatCurrency(totalPrice, currency)}
        <span className="text-sm font-normal ml-2 text-accent/80">
          ({formatCurrency(pricePerPerson, currency)}{t.perPerson})
        </span>
      </div>

      <Button 
        type="submit"
        onClick={onSubmit}
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
      >
        {t.submit}
      </Button>
    </motion.div>
  );
}