/**
 * Format a number as currency with proper thousand separators
 * @param amount - The number to format
 * @param locale - The locale to use for formatting (default: "en-US")
 * @returns Formatted currency string without currency symbol
 */
export function formatCurrency(
  amount: number | string,
  locale: string = "en-US"
): string {
  // Handle null, undefined, or empty string
  if (amount === null || amount === undefined || amount === "") return "0.00";

  // Convert string to number if needed
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  // Handle NaN
  if (isNaN(numericAmount)) return "0.00";

  try {
    // Format with Intl.NumberFormat
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(numericAmount);
  } catch (error) {
    // Fallback in case of invalid locale or other issues
    console.warn(
      `Currency formatting error: ${error}. Using default formatting.`
    );
    return numericAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

/**
 * Parse a formatted currency string back to a number
 * @param formattedAmount - The formatted currency string
 * @returns Number value
 */
export function parseCurrency(formattedAmount: string): number {
  // Remove all non-numeric characters except decimal point
  const numericString = formattedAmount.replace(/[^\d.]/g, "");
  const value = parseFloat(numericString);
  return isNaN(value) ? 0 : value;
}
