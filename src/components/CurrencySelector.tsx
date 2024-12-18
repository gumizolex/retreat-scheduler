import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Currency } from "@/types/program";

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const currencies: Currency[] = ['HUF', 'RON', 'EUR'];

  return (
    <Select value={selectedCurrency} onValueChange={(value: Currency) => onCurrencyChange(value)}>
      <SelectTrigger className="w-[140px] bg-white">
        <SelectValue placeholder="Select currency">
          {selectedCurrency}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        {currencies.map((currency) => (
          <SelectItem
            key={currency}
            value={currency}
            className="cursor-pointer hover:bg-gray-100"
          >
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}