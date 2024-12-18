import { Button } from "@/components/ui/button";
import { Currency } from "@/types/program";

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  return (
    <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg">
      {(['HUF', 'RON', 'EUR'] as Currency[]).map((currency) => (
        <Button
          key={currency}
          variant={selectedCurrency === currency ? "default" : "ghost"}
          size="sm"
          onClick={() => onCurrencyChange(currency)}
          className="transition-all duration-200"
        >
          {currency}
        </Button>
      ))}
    </div>
  );
}