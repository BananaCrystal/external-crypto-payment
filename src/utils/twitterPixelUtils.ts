/**
 * Twitter Pixel Integration for Crypto Payment Tracking
 *
 * This file contains utilities and documentation for X (Twitter) pixel tracking
 * implementation in the crypto payment system.
 */

export interface TrackingData {
  amount: number;
  currency: string;
  email: string;
  phoneNumber: string;
  orderId?: string;
  cardType?: string;
  productName?: string;
}

/**
 * Event ID Configuration
 * Replace with your actual X pixel event ID
 */
export const TWITTER_PIXEL_CONFIG = {
  BASE_PIXEL_ID: "q5wia",
  EVENT_ID: "tw-q5wia-q5wib",
};

/**
 * Validates if Twitter pixel is loaded and available
 */
export const isTwitterPixelLoaded = (): boolean => {
  return typeof window !== "undefined" && typeof window.twq === "function";
};

/**
 * Logs pixel tracking information for debugging
 */
export const logPixelEvent = (data: TrackingData, success: boolean = true) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Twitter Pixel] ${success ? "SUCCESS" : "FAILED"}:`, {
      event: TWITTER_PIXEL_CONFIG.EVENT_ID,
      data,
      timestamp: new Date().toISOString(),
      pixelLoaded: isTwitterPixelLoaded(),
    });
  }
};

/**
 * Test function to verify pixel integration
 * Call this from browser console: window.testTwitterPixel()
 */
if (typeof window !== "undefined") {
  (window as any).testTwitterPixel = () => {
    const testData: TrackingData = {
      amount: 100,
      currency: "USDT",
      email: "test@example.com",
      phoneNumber: "+1234567890",
      orderId: "test_order_123",
      cardType: "USDT",
      productName: "Test Crypto Card Purchase",
    };

    if (isTwitterPixelLoaded()) {
      console.log("✅ Twitter pixel is loaded and ready");
      console.log("Test data would be sent:", testData);
      return true;
    } else {
      console.error("❌ Twitter pixel is not loaded");
      return false;
    }
  };
}
