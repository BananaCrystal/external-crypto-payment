"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { PaymentFormProps, StoreDetails, FormData } from "@/types/paymentTypes";

import { safeJsonParse } from "@/helpers/paymentHelpers";
import { formatCurrency } from "@/helpers/paymentHelpers";

import {
  PROCESSING_FEE_PERCENTAGE,
  TIMER_DURATION,
  STORE_API_BASE_URL,
  PAYMENT_API_BASE_URL,
  USER_SIGNUP_URL,
  CRM_INTEGRATION_URL,
} from "@/constants/paymentConstants";
import { COUNTRY_CODES } from "@/constants/countries";
import { sendToGoHighLevel } from "@/helpers/sendToGoHighLevel";

import { BananaCrystalFooter } from "./BananaCrystalFooter";
import { PaymentDetailsStep } from "./PaymentDetailsStep";
import { PaymentCompleteStep } from "./PaymentCompleteStep";
import DirectPayment from "./DirectPayment";

// Add these animation classes to style section
const animationStyles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-out forwards;
}
`;

export default function PaymentForm({
  storeId,
  amount: initialAmount,
  currency: initialCurrency,
  description,
  usd_amount: initialUsdAmount,
  redirect_url,
  walletAddressFromParams,
  crmDetails,
  gohighlevelApiKey,
  productName,
}: PaymentFormProps) {
  const STORE_API_URL = `${STORE_API_BASE_URL}/stores/${storeId}`;
  const PAYMENT_API_URL = `${PAYMENT_API_BASE_URL}/stores/${storeId}/external_store_payments`;

  const [step, setStep] = useState(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("paymentStep");

      return savedStep ? parseInt(savedStep) : 1;
    }
    return 1;
  });

  const [formData, setFormData] = useState<Omit<FormData, "wallet_address">>(
    () => {
      const savedFormData = safeJsonParse("paymentFormData");
      if (savedFormData?.productName) {
        // Remove productName from saved form data if it exists
        delete savedFormData.productName;
      }

      return {
        firstName: savedFormData?.firstName || "",
        lastName: savedFormData?.lastName || "",
        email: savedFormData?.email || "",
        phoneNumber: savedFormData?.phoneNumber || "",
        tags: savedFormData?.tag || "incomplete",
        street: savedFormData?.street || "",
        city: savedFormData?.city || "",
        state: savedFormData?.state || "",
        postalCode: savedFormData?.postalCode || "",
        country: savedFormData?.country || "",
        currency: savedFormData?.currency || initialCurrency,
        amount: savedFormData?.amount || initialAmount,
        usd_amount: savedFormData?.usd_amount || initialUsdAmount,
        trxn_hash: savedFormData?.trxn_amount || "",
      };
    }
  );

  // State for phone number country code
  const [countryCode, setCountryCode] = useState(() => {
    if (typeof window !== "undefined") {
      // Keep the saved country code for persistence
      return (
        localStorage.getItem("paymentCountryCode") ||
        COUNTRY_CODES[0]?.code ||
        ""
      );
    }
    return COUNTRY_CODES[0]?.code || "";
  });

  // State for store details fetched from API
  const [storeDetails, setStoreDetails] = useState<StoreDetails | null>(null);
  const [storeLoading, setStoreLoading] = useState(true);
  // storeError indicates if the API fetch itself failed
  const [storeError, setStoreError] = useState<string | null>(null);

  // State for payment submission loading and form-specific errors
  const [loading, setLoading] = useState(false);
  // error indicates form validation errors or payment submission errors
  const [error, setError] = useState<string | null>(null);

  // --- Timer State ---
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== "undefined" && step === 2) {
      const savedTime = localStorage.getItem("paymentTimeLeft");
      const savedStep = localStorage.getItem("paymentStep");
      if (savedStep === "2" && savedTime !== null) {
        const time = parseInt(savedTime, 10);
        return time > 0 ? time : 0;
      }
    }
    return TIMER_DURATION;
  });

  const [timerActive, setTimerActive] = useState(() => {
    if (typeof window !== "undefined" && step === 2) {
      const savedTime = localStorage.getItem("paymentTimeLeft");
      const savedStep = localStorage.getItem("paymentStep");
      if (savedStep === "2" && savedTime !== null) {
        return parseInt(savedTime, 10) > 0;
      }
    }
    return false;
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // effectiveWalletAddress correctly prioritizes storeDetails over walletAddressFromParams, and updates automatically
  const effectiveWalletAddress = useMemo(
    () => storeDetails?.wallet_address || walletAddressFromParams,
    [storeDetails, walletAddressFromParams]
  );

  const canProceedToPayment = useMemo(
    () => !!effectiveWalletAddress,
    [effectiveWalletAddress]
  );

  // Calculate amounts including the processing fee
  const processingFee = useMemo(
    () => formData.amount * PROCESSING_FEE_PERCENTAGE,
    [formData.amount]
  );
  const totalAmountDue = useMemo(
    () => formData.amount + processingFee,
    [formData.amount, processingFee]
  );
  const processingFeeUsd = useMemo(
    () => formData.usd_amount * PROCESSING_FEE_PERCENTAGE,
    [formData.usd_amount]
  );
  const totalUsdAmountDue = useMemo(
    () => formData.usd_amount + processingFeeUsd,
    [formData.usd_amount, processingFeeUsd]
  );

  // New state for direct payment feature
  const [showDirectPayment, setShowDirectPayment] = useState(true); // Enable by default
  const [directPaymentProcessing, setDirectPaymentProcessing] = useState(false);
  const [directPaymentError, setDirectPaymentError] = useState<string | null>(
    null
  );

  // Effect to fetch store details
  useEffect(() => {
    const fetchStoreDetails = async () => {
      setStoreLoading(true);
      setStoreError(null);
      try {
        if (!storeId) {
          setStoreError("Store ID is missing. Cannot load store details.");
          setStoreLoading(false);
          return;
        }

        const response = await fetch(STORE_API_URL);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }
        const data: StoreDetails = await response.json();
        setStoreDetails(data);
      } catch (error: any) {
        console.error("Failed to fetch store details:", error);
        setStoreError(
          "Could not load store information. Please try again later."
        );
        setStoreDetails(null);
      } finally {
        setStoreLoading(false);
      }
    };

    fetchStoreDetails();
  }, [storeId, STORE_API_URL]);

  useEffect(() => {
    // Check if the current formData state values differ from the initial props
    const amountChanged =
      initialAmount !== undefined && formData.amount !== initialAmount;
    const currencyChanged =
      initialCurrency !== undefined && formData.currency !== initialCurrency;
    const usdAmountChanged =
      initialUsdAmount !== undefined &&
      formData.usd_amount !== initialUsdAmount;

    if (amountChanged || currencyChanged || usdAmountChanged) {
      console.log(
        "Detected change in initial props. Updating state and localStorage."
      );
      setFormData((prevFormData) => {
        const newFormData = {
          ...prevFormData,

          amount: amountChanged ? initialAmount : prevFormData.amount,
          currency: currencyChanged ? initialCurrency : prevFormData.currency,
          usd_amount: usdAmountChanged
            ? initialUsdAmount
            : prevFormData.usd_amount,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("paymentFormData", JSON.stringify(newFormData));
        }

        return newFormData;
      });
    }
  }, [initialAmount, initialCurrency, initialUsdAmount]);

  // --- Timer Effect ---
  useEffect(() => {
    if (step === 2 && timerActive) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(timerIntervalRef.current!);
            timerIntervalRef.current = null;
            setTimerActive(false);
            if (typeof window !== "undefined") {
              localStorage.setItem("paymentTimerActive", "false");
              localStorage.setItem("paymentTimeLeft", "0");
            }
            setError("Payment window expired. Please request more time.");
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [step, timerActive]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("paymentStep", step.toString());

      localStorage.setItem("paymentCountryCode", countryCode);
      if (step === 2 || timerActive) {
        localStorage.setItem("paymentTimeLeft", timeLeft.toString());
        localStorage.setItem("paymentTimerActive", timerActive.toString());
      } else {
        localStorage.removeItem("paymentTimeLeft");
        localStorage.removeItem("paymentTimerActive");
      }
    }
  }, [step, countryCode, timeLeft, timerActive]); // Removed formData from dependencies

  // Function to reset the payment session
  const resetSession = useCallback(() => {
    setStep(1);
  }, []);

  // Modified function to send data to GoHighLevel with payment status
  const sendToGHL = useCallback(
    async (paymentStatus: "not paid" | "paid") => {
      if (!gohighlevelApiKey) {
        console.log("No GoHighLevel API key provided, skipping integration");
        return;
      }

      if (!productName) {
        console.error("Product name is required for GoHighLevel integration");
        return;
      }

      try {
        console.log(
          `Sending data to GoHighLevel with status: ${paymentStatus}`
        );
        await sendToGoHighLevel(
          formData,
          countryCode,
          paymentStatus,
          gohighlevelApiKey,
          productName
        );
        console.log(
          `Contact sent to GoHighLevel successfully with ${paymentStatus} status and product tag.`
        );
      } catch (ghlError: any) {
        console.error(
          `Error sending contact to GoHighLevel with ${paymentStatus} status:`,
          ghlError
        );
      }
    },
    [formData, countryCode, gohighlevelApiKey, productName]
  );

  // Function to send data to CRM
  const sendToCRM = useCallback(
    async (status: "incomplete" | "complete") => {
      // ... (CRM logic remains the same)
      if (!crmDetails || !crmDetails.enabled) return;

      try {
        const fullAddress = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`;

        const crmData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: `${countryCode}${formData.phoneNumber}`,
          address: fullAddress,
          amount: formData.amount, // Use state value
          currency: formData.currency, // Use state value
          status: status,
          paymentDate: status === "complete" ? new Date().toISOString() : null,
          transactionHash: status === "complete" ? formData.trxn_hash : null,
          storeId: storeId,
          storeName: storeDetails?.name || "Unknown Store",
          usdAmount: formData.usd_amount, // Use state value
          description: description,
          processingFee: processingFee,
          totalAmountDue: totalAmountDue,

          totalUsdAmountDue: totalUsdAmountDue,
        };

        const tagToSend =
          status === "complete"
            ? crmDetails.tagComplete
            : crmDetails.tagIncomplete;

        await fetch(CRM_INTEGRATION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: crmDetails.provider,
            apiKey: crmDetails.apiKey,
            listId: crmDetails.listId,
            tag: tagToSend,
            userData: crmData,
          }),
        });

        console.log(
          `Data sent to ${crmDetails.provider} CRM with status: ${status}`
        );
      } catch (error) {
        console.error("Failed to send data to CRM:", error);
      }
    },

    [
      crmDetails,
      formData,
      countryCode,
      storeId,
      storeDetails?.name,
      description,
      processingFee,
      totalAmountDue,
      totalUsdAmountDue,
      CRM_INTEGRATION_URL,
    ]
  );

  const handleMoreTime = useCallback(() => {
    setTimeLeft(TIMER_DURATION);
    setTimerActive(true);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.setItem("paymentTimeLeft", TIMER_DURATION.toString());
      localStorage.setItem("paymentTimerActive", "true");
      localStorage.setItem("paymentStep", "2");
    }
  }, []);

  const handlePasteTransactionHash = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      console.warn("Clipboard API not available.");
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData((prev) => {
          const newFormData = { ...prev, trxn_hash: text };
          // Save to localStorage immediately on user input change
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "paymentFormData",
              JSON.stringify(newFormData)
            );
          }
          return newFormData;
        });
      }
    } catch (err) {
      console.error("Failed to paste from clipboard:", err);
    }
  }, []);

  // Handle transaction hash from direct payment
  const handleDirectPaymentComplete = useCallback((hash: string) => {
    console.log("Direct payment successful with hash:", hash);

    // Update form data with the transaction hash
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        trxn_hash: hash,
      };

      // Save to localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("paymentFormData", JSON.stringify(newFormData));
      }

      return newFormData;
    });

    // Automatically submit the form after getting the hash
    const event = new Event("submit", { cancelable: true, bubbles: true });
    // Need to defer slightly to ensure form state is updated
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) {
        form.dispatchEvent(event);
      }
    }, 500);

    setDirectPaymentProcessing(false);
  }, []);

  const handleDirectPaymentStart = useCallback(() => {
    setDirectPaymentProcessing(true);
    setDirectPaymentError(null);
  }, []);

  const handleDirectPaymentError = useCallback((error: Error) => {
    console.error("Direct payment error:", error);
    setDirectPaymentError(error.message);
    setDirectPaymentProcessing(false);
  }, []);

  // Add this new handler for wallet disconnection
  const handleWalletDisconnected = useCallback(() => {
    console.log("Wallet disconnected in PaymentForm");

    // Clear any wallet-related state
    if (typeof window !== "undefined") {
      // Don't remove all payment form data, just the wallet-specific state
      const savedFormData = safeJsonParse("paymentFormData");
      if (savedFormData) {
        // Remove any wallet-specific data but keep the form data
        delete savedFormData.wallet_connected;
        localStorage.setItem("paymentFormData", JSON.stringify(savedFormData));
      }
    }

    // Set wallet disconnect flag
    localStorage.setItem("walletManuallyDisconnected", "true");

    // Reset direct payment states
    setDirectPaymentProcessing(false);
    setDirectPaymentError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        if (step === 1) {
          if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.phoneNumber ||
            !formData.street ||
            !formData.city ||
            !formData.country
          ) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
          }

          // Send data to GoHighLevel with "not paid" status
          try {
            await sendToGHL("not paid");
            console.log(
              "Contact sent to GoHighLevel with 'not paid' status successfully."
            );
          } catch (ghlError: any) {
            // Log the error but continue with form submission
            console.error(
              "Error sending contact to GoHighLevel with 'not paid' status:",
              ghlError
            );
          }

          if (!canProceedToPayment) {
            setError(
              "Payment address is not available. Cannot proceed to payment."
            );
            setLoading(false);
            console.error(
              "Cannot proceed: Effective wallet address is missing."
            );
            return;
          }

          await sendToCRM("incomplete");

          setStep(2);
          setTimeLeft(TIMER_DURATION);
          setTimerActive(true);
          if (typeof window !== "undefined") {
            localStorage.setItem("paymentTimeLeft", TIMER_DURATION.toString());
            localStorage.setItem("paymentTimerActive", "true");
            localStorage.setItem("paymentStep", "2");
          }

          setLoading(false);
          return;
        }

        if (!timerActive) {
          setError("Payment window expired. Please request more time.");
          setLoading(false);
          return;
        }

        if (!formData.trxn_hash) {
          setError("Please enter the transaction hash to confirm payment.");
          setLoading(false);
          return;
        }

        if (!effectiveWalletAddress) {
          setError(
            "Payment address not available. Cannot proceed with payment."
          );
          setLoading(false);
          console.error(
            "Payment attempt failed: Effective wallet address is missing."
          );
          return;
        }

        console.log("Proceeding with payment verification API calls...");

        const fullAddress = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`;

        try {
          await fetch(USER_SIGNUP_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone: `${countryCode}${formData.phoneNumber}`,
              address: fullAddress,
            }),
          });
          console.log("Signup request sent.");
        } catch (error) {
          console.error("Signup error:", error);
        }

        console.log("Sending payment data to API...");
        const response = await fetch(PAYMENT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gross_amount: totalUsdAmountDue.toFixed(2),
            currency: "USD",
            fees: processingFee.toFixed(2),
            description: description,
            usd_amount: totalUsdAmountDue.toFixed(2),
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: `${countryCode}${formData.phoneNumber}`,
            address: fullAddress,
            trxn_hash: formData.trxn_hash,
            signup_consent: true,
            wallet_address: effectiveWalletAddress,
          }),
        });

        let result = null;
        let responseText = null;
        try {
          responseText = await response.text();
          if (responseText && responseText.trim().length > 0) {
            result = JSON.parse(responseText);
          }
        } catch (error) {
          console.warn(
            "Failed to parse JSON response, raw text:",
            responseText,
            error
          );
          if (!(response.status >= 200 && response.status < 300)) {
            throw new Error(
              `Payment verification failed: Invalid response from server. Raw: ${responseText}`
            );
          }
        }

        if (response.status >= 200 && response.status < 300) {
          console.log("Payment successful:", result || "No response body");

          // Send data to GoHighLevel with "paid" status after successful payment
          try {
            await sendToGHL("paid");
            console.log(
              "Contact sent to GoHighLevel with 'paid' status successfully."
            );
          } catch (ghlError: any) {
            // Log the error but continue
            console.error(
              "Error sending contact to GoHighLevel with 'paid' status:",
              ghlError
            );
          }

          await sendToCRM("complete");

          // Clear all localStorage data
          cleanupAllLocalStorage();

          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }

          // Redirect to success page with redirect URL if available
          const successUrl = new URL(
            "/payment-success",
            window.location.origin
          );
          if (redirect_url) {
            successUrl.searchParams.set("redirect_url", redirect_url);
          }
          window.location.href = successUrl.toString();
          return;
        } else {
          console.error("Payment API response error:", response.status, result);
          const errorMessage =
            result?.message ||
            result?.error ||
            (responseText
              ? `Payment verification failed: ${responseText}`
              : `Payment verification failed (Status: ${response.status})`);

          throw new Error(errorMessage);
        }
      } catch (error: any) {
        console.error("Payment submission error:", error);
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Payment verification failed: Unknown error";

        setError(errorMsg);

        const errorToast = document.createElement("div");
        errorToast.className =
          "fixed bottom-4 left-4 bg-red-50 text-red-800 p-4 rounded-lg shadow-lg z-50 animate-slide-in max-w-md";
        errorToast.innerHTML = `<div class="flex items-start space-x-3"> <span class="text-xl flex-shrink-0">❌</span> <div> <p class="font-semibold">Payment Error</p> <p class="text-sm break-words">${errorMsg}</p> </div></div>`;
        document.body.appendChild(errorToast);

        setTimeout(() => {
          errorToast.classList.add("animate-slide-out");
          setTimeout(() => errorToast.remove(), 300);
        }, 7000);
      } finally {
        setLoading(false);
        // Clear direct payment processing state if it was active
        setDirectPaymentProcessing(false);
      }
    },
    [
      step,
      formData,
      countryCode,
      description,
      redirect_url,
      sendToCRM,
      effectiveWalletAddress,
      timerActive,
      USER_SIGNUP_URL,
      PAYMENT_API_URL,
      initialAmount,
      initialCurrency,
      initialUsdAmount,
      canProceedToPayment,
      totalUsdAmountDue,
      sendToGHL,
      processingFee,
    ]
  );

  // Handle input changes and clear error when user types
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        const newFormData = {
          ...prev,
          [name]: value,
        };
        // Save to localStorage immediately on user input change
        if (typeof window !== "undefined") {
          localStorage.setItem("paymentFormData", JSON.stringify(newFormData));
        }
        return newFormData;
      });

      if (error) setError(null);
    },
    [error] // Clear error when inputs change
  );

  // Memoized function to copy text to clipboard and show toast
  const copyToClipboard = useCallback((text: string | null | undefined) => {
    if (!text) return;
    navigator.clipboard.writeText(text);

    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-purple-50 text-purple-800 p-4 rounded-lg shadow-lg z-50 animate-slide-in";
    toast.innerHTML = `<div class="flex items-center gap-2"><span>📋</span><p>Address copied to clipboard!</p></div>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("animate-slide-out");
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }, []);

  const brandPurple = "#4c3f84";
  const baseInputClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[${brandPurple}] focus:border-[${brandPurple}] disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400 text-sm`;
  const baseSelectClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-[${brandPurple}] focus:border-[${brandPurple}] text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed text-sm`;
  const baseButtonClasses = `w-full bg-[${brandPurple}] text-white py-3 sm:py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none text-lg font-semibold`;
  const secondaryButtonClasses =
    "w-full bg-gray-200 text-gray-800 py-3 rounded-lg transition-all duration-300 hover:bg-gray-300 text-lg font-semibold";

  // Add cleanup function to clear all data from localStorage
  const cleanupAllLocalStorage = () => {
    // Payment specific data
    localStorage.removeItem("paymentStep");
    localStorage.removeItem("paymentFormData");
    localStorage.removeItem("paymentCountryCode");
    localStorage.removeItem("paymentTimeLeft");
    localStorage.removeItem("paymentTimerActive");

    // Wallet related data
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletManuallyDisconnected");
    localStorage.removeItem("directPaymentData");

    // Any other payment related data
    localStorage.removeItem("lastPaymentHash");
    localStorage.removeItem("pendingPayment");
  };

  // Add a function to remove wallet_address from URL
  const removeWalletAddressFromUrl = () => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("wallet_address")) {
        url.searchParams.delete("wallet_address");
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  };

  // Call this function early in the component lifecycle
  useEffect(() => {
    removeWalletAddressFromUrl();
  }, []);

  // Add this style tag to the document head when component mounts
  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleTag = document.createElement("style");
      styleTag.innerHTML = animationStyles;
      document.head.appendChild(styleTag);

      return () => {
        document.head.removeChild(styleTag);
      };
    }
  }, []);

  // --- Loading/Error state before rendering the form ---
  if (storeLoading) {
    return (
      <div className="max-w-xl w-full mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
        <svg
          className={`animate-spin mx-auto h-10 w-10 text-[${brandPurple}]`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-gray-700">Loading store details...</p>
        <BananaCrystalFooter />
      </div>
    );
  }

  // If store details failed to load AND we don't have an effective wallet address from params
  if (storeError && !effectiveWalletAddress) {
    return (
      <div className="max-w-xl w-full mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
        <p className="text-red-600 mb-4">
          ⚠️ {storeError}
          <span className="block mt-2">
            Could not load necessary store information and no fallback payment
            address was provided.
          </span>
        </p>
        <p className="text-gray-600 text-sm">
          Please refresh the page or contact support if the problem persists.
          {storeDetails?.store_support_email && (
            <span className="block mt-2">
              Support Email:{" "}
              <a
                href={`mailto:${storeDetails.store_support_email}`}
                className="underline"
              >
                {storeDetails.store_support_email}
              </a>
            </span>
          )}
        </p>
        <BananaCrystalFooter />
      </div>
    );
  }

  // If we finished loading, but still no effective wallet address
  // This is a separate error state from store loading failure
  if (!storeLoading && !effectiveWalletAddress) {
    return (
      <div className="max-w-xl w-full mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
        <p className="text-red-600 mb-4">
          ⚠️ Payment address is missing.
          <span className="block mt-2">
            Cannot accept payments at this time. Please contact the store.
          </span>
        </p>
        {storeDetails?.store_support_email && (
          <p className="text-gray-600 text-sm mt-4">
            Support Email:{" "}
            <a
              href={`mailto:${storeDetails.store_support_email}`}
              className="underline"
            >
              {storeDetails.store_support_email}
            </a>
          </p>
        )}
        <BananaCrystalFooter />
      </div>
    );
  }

  // --- Main Form Render (only if !storeLoading AND effectiveWalletAddress is available) ---
  // Add storeError || !effectiveWalletAddress check here too?
  // The above checks already handle the cases where we should NOT render the form.
  // So if we reach here, it's safe to render.
  return (
    <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      <div
        className={`bg-white rounded-xl shadow-2xl overflow-hidden md:grid md:grid-cols-2 transform transition-all duration-500 min-h-[600px] border border-[${brandPurple}]`}
      >
        {/* Left Column: Store Information & Branding */}
        <div
          className={`bg-[${brandPurple}] text-white p-6 sm:p-8 flex flex-col justify-between rounded-t-xl md:rounded-tr-none md:rounded-l-xl relative overflow-hidden`}
        >
          {/* Background pattern for visual interest */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-purple-400"></div>
            <div className="absolute -left-10 top-40 w-40 h-40 rounded-full bg-purple-400"></div>
            <div className="absolute right-10 bottom-40 w-32 h-32 rounded-full bg-purple-400"></div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col">
            {/* Top Section */}
            <div className="mb-8">
              <div className="mb-6 text-center">
                {storeDetails?.store_logo ? (
                  <img
                    src={storeDetails.store_logo}
                    alt={`${storeDetails.name} logo`}
                    className="mx-auto h-24 w-24 object-cover rounded-full border-4 border-white shadow-md"
                  />
                ) : (
                  <div
                    className={`mx-auto h-24 w-24 bg-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-md`}
                  >
                    {storeDetails?.name
                      ? storeDetails.name.charAt(0).toUpperCase()
                      : storeId.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2">
                {storeDetails?.name || `Store ${storeId}`}
              </h1>

              {storeDetails?.store_username && (
                <p className="text-purple-200 text-center text-lg sm:text-xl mb-4">
                  @{storeDetails.store_username}
                </p>
              )}
            </div>

            {/* Middle Section - Contact & Info */}
            <div className="bg-purple-600/30 rounded-lg p-4 mb-6 space-y-3">
              {storeDetails?.store_support_email && (
                <div className="flex items-center text-purple-100 text-base">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-purple-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a
                    href={`mailto:${storeDetails.store_support_email}`}
                    className="hover:underline break-words"
                  >
                    {storeDetails.store_support_email}
                  </a>
                </div>
              )}
              {storeDetails?.store_url && (
                <div className="flex items-center text-purple-100 text-base">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-purple-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0l3 3a2 2 0 11-2.828 2.828l-3-3a2 2 0 010-2.828 1 1 0 00-1.414-1.414 4 4 0 00-5.656 0l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5a2 2 0 002.828 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <a
                    href={storeDetails.store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline break-words"
                  >
                    {storeDetails.store_url.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </div>
              )}
            </div>

            {/* Transaction Description */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-purple-100 mb-2">
                Transaction Details
              </h3>
              <p className="text-purple-200 text-base italic">
                {description || "Secure cryptocurrency payment"}
              </p>
              <div className="mt-3 bg-purple-600/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-200">Amount:</span>
                  <span className="font-bold text-white">
                    {formatCurrency(formData.amount)} {formData.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">USDT:</span>
                  <span className="font-bold text-white">
                    ${formatCurrency(totalUsdAmountDue.toFixed(2))}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Instructions */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-purple-100 mb-3">
                Payment Steps
              </h3>
              <ol className="space-y-2 text-purple-100 text-sm pl-1">
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center mr-2 text-xs">
                    1
                  </span>
                  <span>Connect your wallet or copy the payment address</span>
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center mr-2 text-xs">
                    2
                  </span>
                  <span>Send the exact USDT amount on Polygon network</span>
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center mr-2 text-xs">
                    3
                  </span>
                  <span>Submit the transaction hash to confirm</span>
                </li>
              </ol>
            </div>

            {/* Network Information */}
            <div className="bg-purple-600/30 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-purple-100 mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Important Network Information
              </h3>
              <div className="pl-7 text-sm text-purple-200 space-y-2">
                <p>
                  <span className="text-white font-medium">Network:</span>{" "}
                  Polygon/MATIC only
                </p>
                <p>
                  <span className="text-white font-medium">Token:</span> USDT
                  (Tether)
                </p>
                <p>
                  <span className="text-white font-medium">Gas Fees:</span>{" "}
                  Typically under $0.01
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-purple-100 mb-3">
                FAQ
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-medium text-sm">
                    How long do transactions take?
                  </h4>
                  <p className="text-purple-200 text-xs">
                    Polygon transactions usually confirm within 1-2 minutes.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">
                    What if I send from wrong network?
                  </h4>
                  <p className="text-purple-200 text-xs">
                    Funds sent on other networks may be lost and unrecoverable.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">
                    Need help with your payment?
                  </h4>
                  <p className="text-purple-200 text-xs">
                    Contact support with your transaction hash for assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-purple-600/30 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-purple-200 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div>
                  <h4 className="font-semibold text-purple-100 mb-1">
                    Secure Payment
                  </h4>
                  <p className="text-purple-200 text-sm">
                    This transaction is secured using blockchain technology.
                    Please ensure you're using the Polygon/MATIC network for
                    fast and secure payments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="relative z-10 mt-auto">
            <BananaCrystalFooter />
          </div>
        </div>

        {/* Right Column: Form Steps */}
        <div className="p-6 sm:p-8 flex flex-col justify-between rounded-b-xl md:rounded-bl-none md:rounded-r-xl">
          {step === 1 && (
            <PaymentDetailsStep
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              handleSubmit={handleSubmit}
              loading={loading}
              error={error}
              canProceedToPayment={canProceedToPayment}
              totalAmountDue={totalAmountDue}
              totalUsdAmountDue={totalUsdAmountDue}
              processingFee={processingFee}
              storeError={storeError}
              effectiveWalletAddress={effectiveWalletAddress}
            />
          )}

          {step === 2 && (
            <>
              {/* Add Direct Payment Component */}
              {showDirectPayment && (
                <DirectPayment
                  recipientAddress={effectiveWalletAddress || ""}
                  amountUsd={totalUsdAmountDue}
                  onPaymentComplete={handleDirectPaymentComplete}
                  onPaymentStart={handleDirectPaymentStart}
                  onPaymentError={handleDirectPaymentError}
                  onWalletDisconnect={handleWalletDisconnected}
                  disabled={loading || !timerActive}
                  timerActive={timerActive}
                  timeLeft={timeLeft}
                  handleMoreTime={handleMoreTime}
                />
              )}

              {/* Show the direct payment error if there is one */}
              {directPaymentError && (
                <div className="bg-red-50 rounded-lg p-4 mb-4 animate-shake">
                  <p className="text-red-800 text-sm flex items-center gap-2">
                    <span>⚠️</span> {directPaymentError}
                  </p>
                </div>
              )}

              {/* Separator between payment methods */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">
                    OR
                  </span>
                </div>
              </div>

              {/* Manual payment option title */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Option 2: Manual Payment
                </h3>
                <p className="text-sm text-gray-600">
                  Make a payment manually using your wallet app and paste the
                  transaction hash below.
                </p>
              </div>

              <PaymentCompleteStep
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                loading={loading || directPaymentProcessing}
                error={error}
                effectiveWalletAddress={effectiveWalletAddress}
                totalAmountDue={totalAmountDue}
                totalUsdAmountDue={totalUsdAmountDue}
                processingFee={processingFee}
                processingFeeUsd={processingFeeUsd}
                copyToClipboard={copyToClipboard}
                handlePasteTransactionHash={handlePasteTransactionHash}
                resetSession={resetSession}
                storeError={storeError}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
