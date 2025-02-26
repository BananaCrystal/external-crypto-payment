/**
 * Format a number as currency with 2 decimal places
 */
export function formatCurrency(amount: number, locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(amount);
}

/**
 * Fetch the exchange rate for a currency to USD
 */
export async function fetchExchangeRate(currency: string): Promise<number | null> {
  try {
    // ExchangeRate-API (free tier)
    const response = await fetch(`https://open.er-api.com/v6/latest/USD`);
    const data = await response.json();
    
    if (data.rates && data.rates[currency]) {
      // ExchangeRate-API returns rates relative to base currency (USD)
      return data.rates[currency];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }
}

/**
 * Convert an amount from a specific currency to USD
 */
export async function convertToUsd(amount: number, currency: string): Promise<number | null> {
  if (currency === 'USD') return amount;
  
  const rate = await fetchExchangeRate(currency);
  if (!rate) return null;
  
  return amount / rate;
}

/**
 * Calculate the fee amount based on the payment amount (1.99%)
 */
export function calculateFee(amount: number): number {
  return amount * 0.0199; // 1.99% fee
}

/**
 * Format time in minutes:seconds
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
