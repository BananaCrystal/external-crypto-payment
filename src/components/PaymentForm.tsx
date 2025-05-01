"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { PaymentFormProps, StoreDetails, FormData } from "@/types/paymentTypes";

import { safeJsonParse } from "@/helpers/paymentHelpers";

import {
  PROCESSING_FEE_PERCENTAGE,
  TIMER_DURATION,
  STORE_API_BASE_URL,
  PAYMENT_API_BASE_URL,
  USER_SIGNUP_URL,
  CRM_INTEGRATION_URL,
} from "@/constants/paymentConstants";
import { COUNTRY_CODES } from "@/constants/countries";

import { BananaCrystalFooter } from "./BananaCrystalFooter";
import { PaymentDetailsStep } from "./PaymentDetailsStep";
import { PaymentCompleteStep } from "./PaymentCompleteStep";

export default function PaymentForm({
  storeId,
  amount: initialAmount,
  currency: initialCurrency,
  description,
  usd_amount: initialUsdAmount,
  redirect_url,
  walletAddressFromParams,
  crmDetails,
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

      return {
        firstName: savedFormData?.firstName || "",
        lastName: savedFormData?.lastName || "",
        email: savedFormData?.email || "",
        phoneNumber: savedFormData?.phoneNumber || "",
        street: savedFormData?.street || "",
        city: savedFormData?.city || "",
        state: savedFormData?.state || "",
        postalCode: savedFormData?.postalCode || "",
        country: savedFormData?.country || "",
        currency: savedFormData?.currency || initialCurrency,
        amount: savedFormData?.amount || initialAmount,
        usd_amount: savedFormData?.usd_amount || initialUsdAmount,
        trxn_hash: savedFormData?.trxn_hash || "",
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
            setError("Please fill in all required contact and address fields.");
            setLoading(false);
            return;
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
          await sendToCRM("complete");

          if (typeof window !== "undefined") {
            localStorage.removeItem("paymentStep");
            localStorage.removeItem("paymentFormData");
            localStorage.removeItem("paymentCountryCode");
            localStorage.removeItem("paymentTimeLeft");
            localStorage.removeItem("paymentTimerActive");
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
          }

          const successMessage = document.createElement("div");
          successMessage.className =
            "fixed top-4 right-4 bg-green-50 text-green-800 p-4 rounded-lg shadow-lg z-50 animate-slide-in";
          successMessage.innerHTML = `<div class="flex items-center gap-2"><span>✅</span><p>Payment verified successfully!</p></div>`;
          document.body.appendChild(successMessage);

          setTimeout(() => {
            successMessage.classList.add("animate-slide-out");
            setTimeout(() => {
              successMessage.remove();
              if (redirect_url) {
                window.location.href = redirect_url;
              } else {
                console.log("Payment complete, no redirect URL provided.");
              }
            }, 300);
          }, 3000);
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
      totalUsdAmountDue, // This is correctly in the dependency array
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
          className={`bg-[${brandPurple}] text-white p-6 sm:p-8 flex flex-col justify-between rounded-t-xl md:rounded-tr-none md:rounded-l-xl`}
        >
          <div>
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
              <p className="text-purple-200 text-center text-lg sm:text-xl mb-6">
                @{storeDetails.store_username}
              </p>
            )}
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
            <div className="text-center text-purple-200 text-base italic mt-6">
              {description}
            </div>
          </div>
          <BananaCrystalFooter />
        </div>

        {/* Right Column: Form Steps */}
        <div className="p-6 sm:p-8 flex flex-col justify-between rounded-b-xl md:rounded-bl-none md:rounded-r-xl">
          {step === 1 && (
            <PaymentDetailsStep
              formData={formData}
              setFormData={setFormData} // Pass setFormData down (handlers should save to localStorage)
              handleInputChange={handleInputChange} // Updated to save to localStorage
              countryCode={countryCode}
              setCountryCode={setCountryCode} // Consider if countryCode needs localStorage save here or only in main effect
              handleSubmit={handleSubmit} // Updated to set loading state
              loading={loading}
              error={error}
              canProceedToPayment={canProceedToPayment}
              totalAmountDue={totalAmountDue}
              totalUsdAmountDue={totalUsdAmountDue}
              processingFee={processingFee}
              storeError={storeError} // Pass storeError down for potential display
              effectiveWalletAddress={effectiveWalletAddress} // Pass effective address down
            />
          )}

          {step === 2 && (
            <PaymentCompleteStep
              formData={formData}
              handleInputChange={handleInputChange} // Updated to save to localStorage
              handleSubmit={handleSubmit} // Updated to set loading state
              loading={loading}
              error={error}
              effectiveWalletAddress={effectiveWalletAddress} // Pass effective address down
              totalAmountDue={totalAmountDue}
              totalUsdAmountDue={totalUsdAmountDue}
              processingFee={processingFee}
              processingFeeUsd={processingFeeUsd}
              timerActive={timerActive}
              timeLeft={timeLeft}
              handleMoreTime={handleMoreTime} // Updated to save state on click
              copyToClipboard={copyToClipboard}
              handlePasteTransactionHash={handlePasteTransactionHash} // Updated to save to localStorage
              resetSession={resetSession} // Updated to potentially reset state instead of reload
              storeError={storeError} // Pass storeError down
            />
          )}
        </div>
      </div>
    </div>
  );
}
