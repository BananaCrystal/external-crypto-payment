import React, { useState, useEffect } from "react";
import "./styles.css";
import { PaymentFormProps, PaymentDetails } from "./types";
import { COUNTRY_CODES, FEE_PERCENTAGE } from "./constants";
import { formatCurrency, formatTime, convertToUsd } from "./helpers";

const PaymentForm: React.FC<PaymentFormProps> = ({
  storeId,
  amount,
  currency,
  description,
  walletAddress,
  redirectUrl,
  onSuccess,
  onError,
  isOpen = false,
  onClose,
}) => {
  // If the modal is not open, don't render anything
  if (!isOpen) return null;
  
  // Handle close button click
  const handleClose = () => {
    if (onClose) onClose();
  };

  const [step, setStep] = useState(1);
  const [usdAmount, setUsdAmount] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    signUpConsent: true,
    currency: currency,
    amount: amount,
    usdAmount: 0,
    fees: amount * FEE_PERCENTAGE, // 1.99% fee
    walletAddress: walletAddress,
    trxnHash: "",
  });
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [sessionExpired, setSessionExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("+234");

  // Fetch USD amount on component mount
  useEffect(() => {
    const fetchUsdAmount = async () => {
      try {
        setLoading(true);
        const usdValue = await convertToUsd(amount, currency);
        
        if (usdValue !== null) {
          setUsdAmount(usdValue);
          setFormData(prev => ({
            ...prev,
            usdAmount: usdValue,
          }));
        } else {
          setError(`Failed to convert ${currency} to USD. Please try again.`);
        }
      } catch (err) {
        setError("Currency conversion failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsdAmount();
  }, [amount, currency]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setError("Payment session expired. Please start over.");
      setSessionExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setSessionExpired(true);
          setError("Payment session expired. Please start over.");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      !formData.trxnHash
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
            usd_amount: formData.usdAmount,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: `${countryCode}${formData.phoneNumber}`,
            address: formData.address,
            trxn_hash: formData.trxnHash,
            signup_consent: formData.signUpConsent,
            wallet_address: formData.walletAddress,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Log the full response for debugging
        console.log("Full API response:", result);

        // Get detailed error message from the API response
        const errorMessage =
          result.message || result.error || JSON.stringify(result);
        throw new Error(errorMessage);
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

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(result);
      }

      // Remove success message after 3 seconds
      setTimeout(() => {
        successMessage.classList.add("animate-slide-out");
        setTimeout(() => successMessage.remove(), 300);

        // Redirect after showing success message
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }, 3000);
    } catch (error) {
      // More detailed error handling
      console.error("Payment error (full):", error);

      // Show detailed error message
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Payment verification failed: Unknown error";

      setError(errorMsg);

      // Call onError callback if provided
      if (onError) {
        onError(error);
      }

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

    setFormData((prev) => ({
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

  // Modal overlay and content for step 1
  if (step === 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
        <div className="relative max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-500 animate-slide-up">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
            Payment Details
          </h2>

          <div className="space-y-6 mb-8">
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center gap-3 text-gray-900">
                <span className="text-2xl">🛍️</span>
                <p className="text-lg font-medium">{description}</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(amount)} {currency}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-gray-600">USD Equivalent:</span>
                <span className="text-purple-800">
                  ${usdAmount ? formatCurrency(usdAmount) : "..."}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  className={`${baseSelectClasses} rounded-r-none border-r-0 w-20 bg-gray-100`}
                  disabled={timeLeft <= 0}
                >
                  {COUNTRY_CODES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.country})
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="signUpConsent"
                name="signUpConsent"
                checked={formData.signUpConsent}
                onChange={handleInputChange}
                className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="signUpConsent" className="text-sm text-gray-600">
                I agree to sign up for BananaCrystal and accept the terms of
                service
              </label>
            </div>

            <button
              type="submit"
              className={baseButtonClasses}
              disabled={loading || timeLeft <= 0}
            >
              {timeLeft <= 0 ? "Session Expired" : "Next →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Modal overlay and content for step 2
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="relative max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-500 animate-slide-up">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          Make Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Amount:</span>
              <span className="text-gray-900">
                {formatCurrency(formData.amount)} {formData.currency}
              </span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Fee (1.99%):</span>
              <span className="text-orange-500">
                {formData.fees.toFixed(2)} {formData.currency}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-gray-900">Total Amount:</span>
              <span className="text-gray-900">
                {formatCurrency(formData.amount + formData.fees)} {formData.currency}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
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

          <div className="bg-purple-50 rounded-lg p-6">
            <div className="text-center">
              <div className="text-purple-800 font-medium mb-2">
                USDT Amount to Pay
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ${usdAmount ? formatCurrency(usdAmount) : "..."} USDT
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-900 font-medium">
                Recipient Address (Polygon)
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(formData.walletAddress);
                  alert("Address copied to clipboard!");
                }}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Copy
              </button>
            </div>
            <p className="font-mono text-sm break-all text-gray-600">
              {formData.walletAddress}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Send exactly ${usdAmount ? formatCurrency(usdAmount) : "..."} USDT to the store's
              wallet address on the Polygon network
            </p>
          </div>

          <div>
            <label
              htmlFor="trxnHash"
              className="block text-gray-900 mb-2 font-medium"
            >
              Transaction Hash
            </label>
            <input
              type="text"
              id="trxnHash"
              name="trxnHash"
              required
              className={baseInputClasses}
              value={formData.trxnHash}
              onChange={handleInputChange}
              disabled={timeLeft <= 0}
              placeholder="0x..."
            />
            <p className="text-sm text-gray-500 mt-1">
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
            <div className="bg-red-50 rounded-lg p-6 text-center">
              <p className="text-red-800 font-medium mb-4">
                Payment Session Expired
              </p>
              <p className="text-gray-600 mb-4">
                The payment session has expired. Please start over to generate a
                new payment link.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-purple-900 transition-colors"
              >
                Start Over
              </button>
            </div>
          ) : (
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
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
