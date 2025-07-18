import {
  TWITTER_PIXEL_CONFIG,
  logPixelEvent,
  isTwitterPixelLoaded,
} from "../utils/twitterPixelUtils";

export const useTwitterPixel = () => {
  const trackPurchase = (data: {
    amount: number;
    currency: string;
    email: string;
    phoneNumber: string;
    orderId?: string;
    cardType?: string;
    productName?: string;
  }) => {
    if (!isTwitterPixelLoaded()) {
      console.warn("Twitter pixel is not loaded. Tracking skipped.");
      logPixelEvent(data, false);
      return;
    }

    // Format phone number to E.164 standard (remove non-digits and add +)
    const formatPhoneNumber = (phone: string) => {
      const cleaned = phone.replace(/\D/g, "");
      return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
    };

    const pixelData: TwitterPixelData = {
      value: data.amount,
      currency: data.currency,
      conversion_id: data.orderId || `order_${Date.now()}`,
      email_address: data.email,
      phone_number: formatPhoneNumber(data.phoneNumber),
      contents: [
        {
          content_type: "product",
          content_id: data.cardType || "crypto_card",
          content_name: data.productName || "Crypto Card Purchase",
          content_price: data.amount,
          num_items: 1,
          content_group_id: "crypto_cards",
        },
      ],
    };

    try {
      window.twq!("event", TWITTER_PIXEL_CONFIG.EVENT_ID, pixelData);
      logPixelEvent(data, true);
    } catch (error) {
      console.error("Error tracking Twitter pixel event:", error);
      logPixelEvent(data, false);
    }
  };

  return { trackPurchase };
};
