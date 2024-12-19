export const exchangeRates = {
  HUF: 83.33, // 1 RON = 83.33 HUF
  RON: 1,
  EUR: 4.55 // 1 RON = 0.2 EUR (approximate)
};

export const formatCurrency = (amount: number, currency: "HUF" | "RON" | "EUR") => {
  let converted;
  
  switch (currency) {
    case "HUF":
      converted = amount * exchangeRates.HUF;
      return `${converted.toLocaleString()} Ft`;
    case "RON":
      converted = amount;
      return `${converted.toLocaleString()} RON`;
    case "EUR":
      converted = amount / exchangeRates.EUR;
      return `${converted.toLocaleString()} €`;
  }
};