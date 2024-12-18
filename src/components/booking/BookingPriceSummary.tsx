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
  showBackButton?: boolean;
  onBack?: () => void;
}

export function BookingPriceSummary({ 
  totalPrice, 
  pricePerPerson, 
  currency, 
  t, 
  onSubmit,
  showBackButton = false,
  onBack
}: BookingPriceSummaryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="text-lg font-medium text-accent mb-4">{t.total}</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{t.perPerson}</span>
            <span>{formatCurrency(pricePerPerson, currency)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-accent pt-2 border-t">
            <span>{t.total}</span>
            <span>{formatCurrency(totalPrice, currency)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {showBackButton && onBack && (
          <Button 
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:bg-gray-100"
          >
            {t.back}
          </Button>
        )}
        <Button 
          type="submit"
          onClick={onSubmit}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg ml-auto"
        >
          {t.submit}
        </Button>
      </div>
    </motion.div>
  );
}