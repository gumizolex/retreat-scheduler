export const exchangeRates = {
  HUF: 1,
  RON: 83.33, // 1 RON = 83.33 HUF
  EUR: 380 // 1 EUR = 380 HUF
};

export const formatCurrency = (amount: number, currency: "HUF" | "RON" | "EUR") => {
  let converted;
  
  switch (currency) {
    case "HUF":
      converted = amount;
      return `${converted.toLocaleString()} Ft`;
    case "RON":
      converted = amount / exchangeRates.RON;
      return `${converted.toLocaleString()} RON`;
    case "EUR":
      converted = amount / exchangeRates.EUR;
      return `${converted.toLocaleString()} €`;
  }
};