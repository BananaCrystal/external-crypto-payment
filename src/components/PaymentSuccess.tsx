"use client";

import { useEffect, useState } from "react";
import { BananaCrystalFooter } from "./BananaCrystalFooter";
import { useTwitterPixel } from "../hooks/useTwitterPixel";

interface PaymentSuccessProps {
  redirectUrl?: string;
  countdownSeconds?: number;
}

export default function PaymentSuccess({
  redirectUrl,
  countdownSeconds = 5,
}: PaymentSuccessProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const { trackPurchase } = useTwitterPixel();

  useEffect(() => {
    // Track the purchase with Twitter pixel
    const trackingData = localStorage.getItem("twitterPixelData");
    if (trackingData) {
      try {
        const data = JSON.parse(trackingData);
        trackPurchase({
          amount: data.amount,
          currency: data.currency,
          email: data.email,
          phoneNumber: data.phoneNumber,
          orderId: data.orderId,
          cardType: data.cardType,
          productName: data.productName,
        });

        // Clean up the tracking data after use
        localStorage.removeItem("twitterPixelData");
      } catch (error) {
        console.error("Error parsing Twitter pixel tracking data:", error);
      }
    }
  }, [trackPurchase]);

  useEffect(() => {
    if (!redirectUrl) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = redirectUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your payment. Your transaction has been completed
            successfully.
          </p>
        </div>

        {redirectUrl && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800">
              Redirecting to {redirectUrl} in{" "}
              <span className="font-bold">{countdown}</span> seconds...
            </p>
          </div>
        )}

        {!redirectUrl && (
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-green-800">
              Your payment has been processed successfully. You can now close
              this window.
            </p>
          </div>
        )}

        <BananaCrystalFooter />
      </div>
    </div>
  );
}
