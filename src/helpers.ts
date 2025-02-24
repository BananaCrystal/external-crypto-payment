export function formatCurrency(amount: number, locale: string = "en-US"): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(amount);
  }
  