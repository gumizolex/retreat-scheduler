export const exchangeRates = {
  HUF: 1,
  RON: 0.012, // 1 HUF = 0.012 RON
  EUR: 0.0026 // 1 HUF = 0.0026 EUR
};

export const formatCurrency = (amount: number, currency: "HUF" | "RON" | "EUR") => {
  const converted = amount * exchangeRates[currency];
  
  switch (currency) {
    case "HUF":
      return `${converted.toLocaleString()} Ft`;
    case "RON":
      return `${converted.toLocaleString()} RON`;
    case "EUR":
      return `${converted.toLocaleString()} €`;
  }
};