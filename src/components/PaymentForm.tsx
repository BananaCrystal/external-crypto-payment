"use client";

import { useState, useEffect } from "react";
import { PaymentDetails } from "@/types";
import { COUNTRY_CODES } from "@/constants";
import { formatCurrency } from "@/helpers";

interface PaymentFormProps {
  storeId: string;
  amount: number;
  currency: string;
  description: string;
  usd_amount: number;
  wallet_address: string;
  redirect_url?: string;
}

export default function PaymentForm({
  storeId,
  amount,
  currency: initialCurrency,
  description,
  usd_amount: initialUsdAmount,
  wallet_address,
  redirect_url,
}: PaymentFormProps) {
  // Initialize state with localStorage values if they exist
  const [step, setStep] = useState(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("paymentStep");
      return savedStep ? parseInt(savedStep) : 1;
    }
    return 1;
  });

  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const savedFormData = localStorage.getItem("paymentFormData");
      if (savedFormData) {
        return JSON.parse(savedFormData);
      }
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      signUpConsent: true,
      currency: initialCurrency,
      amount: amount,
      usd_amount: initialUsdAmount,
      fees: amount * 0.02, // 2% fee
      wallet_address: wallet_address,
      trxn_hash: "",
    };
  });

  const [loading, setLoading] = useState(false);

  // Initialize timer from localStorage or set default (30 minutes)
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== "undefined") {
      const savedEndTime = localStorage.getItem("paymentEndTime");
      if (savedEndTime) {
        const endTime = parseInt(savedEndTime);
        const now = Math.floor(Date.now() / 1000);
        const remaining = endTime - now;
        return remaining > 0 ? remaining : 0;
      }
    }
    return 30 * 60; // 30 minutes in seconds
  });

  const [sessionExpired, setSessionExpired] = useState(timeLeft <= 0);
  const [error, setError] = useState<string | null>(null);

  const [countryCode, setCountryCode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("paymentCountryCode") || "+234";
    }
    return "+234";
  });

  // Save step to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("paymentStep", step.toString());
    }
  }, [step]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("paymentFormData", JSON.stringify(formData));
    }
  }, [formData]);

  // Save country code to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("paymentCountryCode", countryCode);
    }
  }, [countryCode]);

  // Initialize and manage timer
  useEffect(() => {
    // If no end time is set in localStorage, set it
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("paymentEndTime")
    ) {
      const endTime = Math.floor(Date.now() / 1000) + 30 * 60; // Current time + 30 minutes
      localStorage.setItem("paymentEndTime", endTime.toString());
    }

    if (timeLeft <= 0) {
      setError("Payment session expired. Please start over.");
      setSessionExpired(true);
      return;
    }

    const timer = setInterval(() => {
      if (typeof window !== "undefined") {
        const savedEndTime = localStorage.getItem("paymentEndTime");
        if (savedEndTime) {
          const endTime = parseInt(savedEndTime);
          const now = Math.floor(Date.now() / 1000);
          const remaining = endTime - now;

          if (remaining <= 0) {
            setTimeLeft(0);
            setSessionExpired(true);
            setError("Payment session expired. Please start over.");
            clearInterval(timer);
          } else {
            setTimeLeft(remaining);
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const resetSession = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("paymentEndTime");
      localStorage.removeItem("paymentStep");
      localStorage.removeItem("paymentFormData");
      localStorage.removeItem("paymentCountryCode");
      window.location.reload();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      setError("Payment session expired. Please start over.");
      return;
    }

    if (step === 1) {
      if (!formData.signUpConsent) {
        setError("Please accept the terms of service to continue");
        return;
      }
      setStep(2);
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.address ||
      !formData.trxn_hash
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Sign up user
      try {
        await fetch("https://app.bananacrystal.com/api/users/sign_up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: `${countryCode}${formData.phoneNumber}`,
            address: formData.address,
          }),
        });
      } catch (error) {
        // Continue even if signup fails
        console.error("Signup error:", error);
      }

      // Send payment data to BananaCrystal API
      const response = await fetch(
        `https://app.bananacrystal.com/api/v1/stores/${storeId}/external_store_payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: formData.amount,
            currency: formData.currency,
            description: description,
            usd_amount: formData.usd_amount,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: `${countryCode}${formData.phoneNumber}`,
            address: formData.address,
            trxn_hash: formData.trxn_hash,
            signup_consent: formData.signUpConsent,
            wallet_address: formData.wallet_address,
          }),
        }
      );

      // Improved response handling
      let result;
      try {
        result = await response.json();
      } catch (error) {
        console.warn("Failed to parse JSON response", error);
        result = null; // If parsing fails, assume empty response
      }

      // Check for success: either response.status === 201 or response is empty (no status)
      if (!response.status || response.status === 201) {
        console.log("Payment successful:", result || "No response body");

        // Clear localStorage on successful payment
        if (typeof window !== "undefined") {
          localStorage.removeItem("paymentEndTime");
          localStorage.removeItem("paymentStep");
          localStorage.removeItem("paymentFormData");
          localStorage.removeItem("paymentCountryCode");
        }

        // Show success message
        const successMessage = document.createElement("div");
        successMessage.className =
          "fixed top-4 right-4 bg-green-50 text-green-800 p-4 rounded-lg shadow-lg z-50 animate-slide-in";
        successMessage.innerHTML = `
          <div class="flex items-center gap-2">
            <span>✅</span>
            <p>Payment verified successfully!</p>
          </div>
        `;
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
          successMessage.classList.add("animate-slide-out");
          setTimeout(() => successMessage.remove(), 300);

          // Redirect after showing success message
          if (redirect_url) {
            window.location.href = redirect_url;
          }
        }, 3000);

        return; // Stop further execution
      }

      // Handle failure cases
      console.log("Full API response:", result);
      const errorMessage =
        result?.message || result?.error || "Unknown error occurred";
      throw new Error(errorMessage);
    } catch (error) {
      // More detailed error handling
      console.error("Payment error (full):", error);

      // Show detailed error message
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Payment verification failed: Unknown error";

      setError(errorMsg);

      // Create error toast for more visibility
      const errorToast = document.createElement("div");
      errorToast.className =
        "fixed bottom-4 left-4 bg-red-50 text-red-800 p-4 rounded-lg shadow-lg z-50 animate-slide-in max-w-md";
      errorToast.innerHTML = `
        <div class="flex items-start gap-2">
          <span class="text-xl">❌</span>
          <div>
            <p class="font-semibold">Payment Error</p>
            <p class="text-sm break-words">${errorMsg}</p>
          </div>
        </div>
      `;
      document.body.appendChild(errorToast);

      // Remove error toast after 5 seconds
      setTimeout(() => {
        errorToast.classList.add("animate-slide-out");
        setTimeout(() => errorToast.remove(), 300);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const baseInputClasses =
    "w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400";
  const baseSelectClasses =
    "w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed";
  const baseButtonClasses =
    "w-full bg-purple-800 text-white py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:bg-purple-900 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);

    // Show toast notification
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-purple-50 text-purple-800 p-4 rounded-lg shadow-lg z-50 animate-slide-in";
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span>📋</span>
        <p>Address copied to clipboard!</p>
      </div>
    `;
    document.body.appendChild(toast);

    // Remove toast after 2 seconds
    setTimeout(() => {
      toast.classList.add("animate-slide-out");
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  if (step === 1) {
    return (
      <div className="max-w-xl w-full mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8 transform transition-all duration-500">
        <h2 className="text-3xl font-bold mb-6 sm:mb-8 text-gray-900 text-center">
          Payment Details
        </h2>

        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          <div className="bg-purple-50 rounded-lg p-4 sm:p-6">
            <div className="flex items-center gap-3 text-gray-900">
              <span className="text-2xl">🛍️</span>
              <p className="text-lg font-medium">{description}</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <div className="text-center">
              <div className="text-blue-800 font-medium mb-2">
                Time Remaining
              </div>
              <div
                className={`text-3xl font-bold ${
                  timeLeft <= 300
                    ? "text-red-600 animate-pulse"
                    : "text-blue-900"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 rounded-lg p-4 animate-shake">
              <p className="text-red-800 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-100">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(amount)} {formData.currency}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-gray-600">USD Equivalent:</span>
              <span className="text-purple-800">
                ${formatCurrency(formData.usd_amount)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-900 mb-2 font-medium"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className={baseInputClasses}
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={timeLeft <= 0}
                placeholder="John"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-900 mb-2 font-medium"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className={baseInputClasses}
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={timeLeft <= 0}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-900 mb-2 font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={baseInputClasses}
              value={formData.email}
              onChange={handleInputChange}
              disabled={timeLeft <= 0}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-gray-900 mb-2 font-medium"
            >
              Phone Number
            </label>
            <div className="flex">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className={`${baseSelectClasses} rounded-r-none border-r-0 w-24 bg-gray-100`}
                disabled={timeLeft <= 0}
              >
                {COUNTRY_CODES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                className={`${baseInputClasses} rounded-l-none`}
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={timeLeft <= 0}
                placeholder="8012345678"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-gray-900 mb-2 font-medium"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              className={baseInputClasses}
              value={formData.address}
              onChange={handleInputChange}
              disabled={timeLeft <= 0}
              placeholder="123 Main St, City"
            />
          </div>

          {!sessionExpired ? (
            <button
              type="submit"
              className={baseButtonClasses}
              disabled={loading || timeLeft <= 0}
            >
              {timeLeft <= 0 ? "Session Expired" : "Next →"}
            </button>
          ) : (
            <button
              type="button"
              onClick={resetSession}
              className={baseButtonClasses}
            >
              Start New Session
            </button>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-xl w-full mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8 transform transition-all duration-500">
      <h2 className="text-3xl font-bold mb-6 sm:mb-8 text-gray-900 text-center">
        Make Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex justify-between font-bold">
            <span className="text-gray-900">Total Amount:</span>
            <span className="text-gray-900">
              {formatCurrency(formData.amount)} {formData.currency}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
          <div className="text-center">
            <div className="text-blue-800 font-medium mb-2">Time Remaining</div>
            <div
              className={`text-3xl font-bold ${
                timeLeft <= 300 ? "text-red-600 animate-pulse" : "text-blue-900"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 sm:p-6">
          <div className="text-center">
            <div className="text-purple-800 font-medium mb-2">
              USDT Amount to Pay
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${formatCurrency(formData.usd_amount.toFixed(2))} USDT
            </div>
          </div>
        </div>

        {/* Improved wallet address section */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 text-white">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-bold text-base sm:text-lg">
                Send Payment To This Address
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(formData.wallet_address)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Copy
              </button>
            </div>
            <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-700">
              <p className="font-mono text-sm sm:text-base break-all text-green-400 select-all">
                {formData.wallet_address}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 text-center">
              Polygon/MATIC Network Only
            </p>
          </div>

          <div className="bg-yellow-800 p-3 sm:p-4 rounded-lg">
            <div className="flex items-start">
              <div className="text-yellow-300 mr-2 text-lg flex-shrink-0">
                ⚠️
              </div>
              <div>
                <p className="text-yellow-200 font-medium">
                  Important Instructions:
                </p>
                <ul className="list-disc pl-4 mt-2 text-yellow-100 text-xs sm:text-sm space-y-1">
                  <li>
                    Send{" "}
                    <span className="font-bold text-white">
                      ${formatCurrency(formData.usd_amount.toFixed(2))} USDT
                    </span>{" "}
                    to the address above
                  </li>
                  <li>
                    Make sure you're using the{" "}
                    <span className="font-bold text-white">
                      Polygon/MATIC Network
                    </span>
                  </li>
                  <li>After sending, copy your transaction hash below</li>
                  <li>Payments on other networks will be lost</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="trxn_hash"
            className="block text-gray-900 mb-2 font-medium"
          >
            Transaction Hash
          </label>
          <input
            type="text"
            id="trxn_hash"
            name="trxn_hash"
            required
            className={baseInputClasses}
            value={formData.trxn_hash}
            onChange={handleInputChange}
            disabled={timeLeft <= 0}
            placeholder="0x..."
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Enter the transaction hash after sending the USDT payment
          </p>
        </div>

        {error && (
          <div className="bg-red-50 rounded-lg p-4 animate-shake">
            <p className="text-red-800 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </p>
          </div>
        )}

        {sessionExpired ? (
          <div className="bg-red-50 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-red-800 font-medium mb-4">
              Payment Session Expired
            </p>
            <p className="text-gray-600 mb-4">
              The payment session has expired. Please start over to generate a
              new payment link.
            </p>
            <button
              type="button"
              onClick={resetSession}
              className="bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-purple-900 transition-colors"
            >
              Start Over
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              type="submit"
              className={baseButtonClasses}
              disabled={loading || timeLeft <= 0}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : timeLeft <= 0 ? (
                "Session Expired"
              ) : (
                "Confirm Payment"
              )}
            </button>

            <button
              type="button"
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg transition-all duration-300 hover:bg-gray-300"
              onClick={() => setStep(1)}
            >
              Back to Details
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
