export const safeJsonParse = (key: string) => {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(key);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error(`Failed to parse JSON from localStorage key "${key}":`, e);
    return null;
  }
};

// Helper to format time in MM:SS
export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${paddedMinutes}:${paddedSeconds}`;
};

export const formatCurrency = (
  amount: number | string,

  currency: string = "",
  locale = "en-US"
) => {
  const numberAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numberAmount)) {
    console.error(`Invalid amount for formatting: ${amount}`);
    return "N/A";
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formatter.format(numberAmount);
  } catch (error) {
    console.error(
      `Error formatting amount ${amount} as decimal with Intl:`,
      error
    );

    return numberAmount.toFixed(2);
  }
};
