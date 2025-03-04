"use client";

import React, { useState, useEffect } from "react";

// Constants
const COUNTRY_CODES = [
  { country: "Afghanistan", code: "+93", isoCode: "AF" }, // Banned
  { country: "Albania", code: "+355", isoCode: "AL" },
  { country: "Algeria", code: "+213", isoCode: "DZ" },
  { country: "Andorra", code: "+376", isoCode: "AD" },
  { country: "Angola", code: "+244", isoCode: "AO" },
  { country: "Antigua and Barbuda", code: "+1-268", isoCode: "AG" },
  { country: "Argentina", code: "+54", isoCode: "AR" },
  { country: "Armenia", code: "+374", isoCode: "AM" },
  { country: "Australia", code: "+61", isoCode: "AU" },
  { country: "Austria", code: "+43", isoCode: "AT" },
  { country: "Azerbaijan", code: "+994", isoCode: "AZ" },
  { country: "Bahamas", code: "+1-242", isoCode: "BS" },
  { country: "Bahrain", code: "+973", isoCode: "BH" },
  { country: "Bangladesh", code: "+880", isoCode: "BD" },
  { country: "Barbados", code: "+1-246", isoCode: "BB" },
  { country: "Belarus", code: "+375", isoCode: "BY" },
  { country: "Belgium", code: "+32", isoCode: "BE" },
  { country: "Belize", code: "+501", isoCode: "BZ" },
  { country: "Benin", code: "+229", isoCode: "BJ" },
  { country: "Bhutan", code: "+975", isoCode: "BT" },
  { country: "Bolivia", code: "+591", isoCode: "BO" },
  { country: "Bosnia and Herzegovina", code: "+387", isoCode: "BA" },
  { country: "Botswana", code: "+267", isoCode: "BW" },
  { country: "Brazil", code: "+55", isoCode: "BR" },
  { country: "Brunei", code: "+673", isoCode: "BN" },
  { country: "Bulgaria", code: "+359", isoCode: "BG" },
  { country: "Burkina Faso", code: "+226", isoCode: "BF" },
  { country: "Burundi", code: "+257", isoCode: "BI" },
  { country: "Cabo Verde", code: "+238", isoCode: "CV" },
  { country: "Cambodia", code: "+855", isoCode: "KH" },
  { country: "Cameroon", code: "+237", isoCode: "CM" },
  { country: "Canada", code: "+1", isoCode: "CA" },
  { country: "Central African Republic", code: "+236", isoCode: "CF" }, // Banned
  { country: "Chad", code: "+235", isoCode: "TD" },
  { country: "Chile", code: "+56", isoCode: "CL" },
  { country: "China", code: "+86", isoCode: "CN" },
  { country: "Colombia", code: "+57", isoCode: "CO" },
  { country: "Comoros", code: "+269", isoCode: "KM" },
  { country: "Congo", code: "+242", isoCode: "CG" },
  { country: "Congo (the Democratic Republic)", code: "+243", isoCode: "CD" }, // Banned
  { country: "Costa Rica", code: "+506", isoCode: "CR" },
  { country: "Côte d'Ivoire", code: "+225", isoCode: "CI" },
  { country: "Croatia", code: "+385", isoCode: "HR" },
  { country: "Cuba", code: "+53", isoCode: "CU" }, // Banned
  { country: "Cyprus", code: "+357", isoCode: "CY" },
  { country: "Czech Republic", code: "+420", isoCode: "CZ" },
  { country: "Denmark", code: "+45", isoCode: "DK" },
  { country: "Djibouti", code: "+253", isoCode: "DJ" },
  { country: "Dominica", code: "+1-767", isoCode: "DM" },
  { country: "Dominican Republic", code: "+1-809", isoCode: "DO" },
  { country: "Ecuador", code: "+593", isoCode: "EC" },
  { country: "Egypt", code: "+20", isoCode: "EG" },
  { country: "El Salvador", code: "+503", isoCode: "SV" },
  { country: "Equatorial Guinea", code: "+240", isoCode: "GQ" },
  { country: "Eritrea", code: "+291", isoCode: "ER" },
  { country: "Estonia", code: "+372", isoCode: "EE" },
  { country: "Eswatini", code: "+268", isoCode: "SZ" },
  { country: "Ethiopia", code: "+251", isoCode: "ET" },
  { country: "Fiji", code: "+679", isoCode: "FJ" },
  { country: "Finland", code: "+358", isoCode: "FI" },
  { country: "France", code: "+33", isoCode: "FR" },
  { country: "Gabon", code: "+241", isoCode: "GA" },
  { country: "Gambia", code: "+220", isoCode: "GM" },
  { country: "Georgia", code: "+995", isoCode: "GE" },
  { country: "Germany", code: "+49", isoCode: "DE" },
  { country: "Ghana", code: "+233", isoCode: "GH" },
  { country: "Greece", code: "+30", isoCode: "GR" },
  { country: "Grenada", code: "+1-473", isoCode: "GD" },
  { country: "Guatemala", code: "+502", isoCode: "GT" },
  { country: "Guinea", code: "+224", isoCode: "GN" },
  { country: "Guinea-Bissau", code: "+245", isoCode: "GW" }, // Banned
  { country: "Guyana", code: "+592", isoCode: "GY" },
  { country: "Haiti", code: "+509", isoCode: "HT" },
  { country: "Honduras", code: "+504", isoCode: "HN" },
  { country: "Hungary", code: "+36", isoCode: "HU" },
  { country: "Iceland", code: "+354", isoCode: "IS" },
  { country: "India", code: "+91", isoCode: "IN" },
  { country: "Indonesia", code: "+62", isoCode: "ID" },
  { country: "Iran", code: "+98", isoCode: "IR" }, // Banned
  { country: "Iraq", code: "+964", isoCode: "IQ" }, // Banned
  { country: "Ireland", code: "+353", isoCode: "IE" },
  { country: "Israel", code: "+972", isoCode: "IL" },
  { country: "Italy", code: "+39", isoCode: "IT" },
  { country: "Jamaica", code: "+1-876", isoCode: "JM" },
  { country: "Japan", code: "+81", isoCode: "JP" },
  { country: "Jordan", code: "+962", isoCode: "JO" },
  { country: "Kazakhstan", code: "+7", isoCode: "KZ" },
  { country: "Kenya", code: "+254", isoCode: "KE" },
  { country: "Kiribati", code: "+686", isoCode: "KI" },
  { country: "Korea, North", code: "+850", isoCode: "KP" }, // Banned
  { country: "Korea, South", code: "+82", isoCode: "KR" },
  { country: "Kuwait", code: "+965", isoCode: "KW" },
  { country: "Kyrgyzstan", code: "+996", isoCode: "KG" },
  { country: "Laos", code: "+856", isoCode: "LA" },
  { country: "Latvia", code: "+371", isoCode: "LV" },
  { country: "Lebanon", code: "+961", isoCode: "LB" },
  { country: "Lesotho", code: "+266", isoCode: "LS" },
  { country: "Liberia", code: "+231", isoCode: "LR" },
  { country: "Libya", code: "+218", isoCode: "LY" }, // Banned
  { country: "Liechtenstein", code: "+423", isoCode: "LI" },
  { country: "Lithuania", code: "+370", isoCode: "LT" },
  { country: "Luxembourg", code: "+352", isoCode: "LU" },
  { country: "Madagascar", code: "+261", isoCode: "MG" },
  { country: "Malawi", code: "+265", isoCode: "MW" },
  { country: "Malaysia", code: "+60", isoCode: "MY" },
  { country: "Maldives", code: "+960", isoCode: "MV" },
  { country: "Mali", code: "+223", isoCode: "ML" }, // Banned
  { country: "Malta", code: "+356", isoCode: "MT" },
  { country: "Marshall Islands", code: "+692", isoCode: "MH" },
  { country: "Mauritania", code: "+222", isoCode: "MR" },
  { country: "Mauritius", code: "+230", isoCode: "MU" },
  { country: "Mexico", code: "+52", isoCode: "MX" },
  { country: "Micronesia", code: "+691", isoCode: "FM" },
  { country: "Moldova", code: "+373", isoCode: "MD" },
  { country: "Monaco", code: "+377", isoCode: "MC" },
  { country: "Mongolia", code: "+976", isoCode: "MN" },
  { country: "Montenegro", code: "+382", isoCode: "ME" },
  { country: "Morocco", code: "+212", isoCode: "MA" },
  { country: "Mozambique", code: "+258", isoCode: "MZ" },
  { country: "Myanmar", code: "+95", isoCode: "MM" },
  { country: "Namibia", code: "+264", isoCode: "NA" },
  { country: "Nauru", code: "+674", isoCode: "NR" },
  { country: "Nepal", code: "+977", isoCode: "NP" },
  { country: "Netherlands", code: "+31", isoCode: "NL" },
  { country: "New Zealand", code: "+64", isoCode: "NZ" },
  { country: "Nicaragua", code: "+505", isoCode: "NI" },
  { country: "Niger", code: "+227", isoCode: "NE" },
  { country: "Nigeria", code: "+234", isoCode: "NG" },
  { country: "North Macedonia", code: "+389", isoCode: "MK" },
  { country: "Norway", code: "+47", isoCode: "NO" },
  { country: "Oman", code: "+968", isoCode: "OM" },
  { country: "Pakistan", code: "+92", isoCode: "PK" },
  { country: "Palau", code: "+680", isoCode: "PW" },
  { country: "Palestine", code: "+970", isoCode: "PS" },
  { country: "Panama", code: "+507", isoCode: "PA" },
  { country: "Papua New Guinea", code: "+675", isoCode: "PG" },
  { country: "Paraguay", code: "+595", isoCode: "PY" },
  { country: "Peru", code: "+51", isoCode: "PE" },
  { country: "Philippines", code: "+63", isoCode: "PH" },
  { country: "Poland", code: "+48", isoCode: "PL" },
  { country: "Portugal", code: "+351", isoCode: "PT" },
  { country: "Qatar", code: "+974", isoCode: "QA" },
  { country: "Romania", code: "+40", isoCode: "RO" },
  { country: "Russia", code: "+7", isoCode: "RU" }, // Banned
  { country: "Rwanda", code: "+250", isoCode: "RW" },
  { country: "Saint Kitts and Nevis", code: "+1-869", isoCode: "KN" },
  { country: "Saint Lucia", code: "+1-758", isoCode: "LC" },
  {
    country: "Saint Vincent and the Grenadines",
    code: "+1-784",
    isoCode: "VC",
  },
  { country: "Samoa", code: "+685", isoCode: "WS" },
  { country: "San Marino", code: "+378", isoCode: "SM" },
  { country: "Sao Tome and Principe", code: "+239", isoCode: "ST" },
  { country: "Saudi Arabia", code: "+966", isoCode: "SA" },
  { country: "Senegal", code: "+221", isoCode: "SN" },
  { country: "Serbia", code: "+381", isoCode: "RS" },
  { country: "Seychelles", code: "+248", isoCode: "SC" },
  { country: "Sierra Leone", code: "+232", isoCode: "SL" },
  { country: "Singapore", code: "+65", isoCode: "SG" },
  { country: "Slovakia", code: "+421", isoCode: "SK" },
  { country: "Slovenia", code: "+386", isoCode: "SI" },
  { country: "Solomon Islands", code: "+677", isoCode: "SB" },
  { country: "Somalia", code: "+252", isoCode: "SO" }, // Banned
  { country: "South Africa", code: "+27", isoCode: "ZA" },
  { country: "South Sudan", code: "+211", isoCode: "SS" }, // Banned
  { country: "Spain", code: "+34", isoCode: "ES" },
  { country: "Sri Lanka", code: "+94", isoCode: "LK" },
  { country: "Sudan", code: "+249", isoCode: "SD" }, // Banned
  { country: "Suriname", code: "+597", isoCode: "SR" },
  { country: "Sweden", code: "+46", isoCode: "SE" },
  { country: "Switzerland", code: "+41", isoCode: "CH" },
  { country: "Syria", code: "+963", isoCode: "SY" }, // Banned
  { country: "Tajikistan", code: "+992", isoCode: "TJ" },
  { country: "Tanzania", code: "+255", isoCode: "TZ" },
  { country: "Thailand", code: "+66", isoCode: "TH" },
  { country: "Timor-Leste", code: "+670", isoCode: "TL" },
  { country: "Togo", code: "+228", isoCode: "TG" },
  { country: "Tonga", code: "+676", isoCode: "TO" },
  { country: "Trinidad and Tobago", code: "+1-868", isoCode: "TT" },
  { country: "Tunisia", code: "+216", isoCode: "TN" },
  { country: "Turkey", code: "+90", isoCode: "TR" },
  { country: "Turkmenistan", code: "+993", isoCode: "TM" },
  { country: "Tuvalu", code: "+688", isoCode: "TV" },
  { country: "Uganda", code: "+256", isoCode: "UG" },
  { country: "Ukraine", code: "+380", isoCode: "UA" }, // Banned
  { country: "United Arab Emirates", code: "+971", isoCode: "AE" },
  { country: "United Kingdom", code: "+44", isoCode: "GB" },
  { country: "United States", code: "+1", isoCode: "US" },
  { country: "Uruguay", code: "+598", isoCode: "UY" },
  { country: "Uzbekistan", code: "+998", isoCode: "UZ" },
  { country: "Vanuatu", code: "+678", isoCode: "VU" },
  { country: "Vatican City", code: "+379", isoCode: "VA" },
  { country: "Venezuela", code: "+58", isoCode: "VE" },
  { country: "Vietnam", code: "+84", isoCode: "VN" },
  { country: "Yemen", code: "+967", isoCode: "YE" }, // Banned
  { country: "Zambia", code: "+260", isoCode: "ZM" },
  { country: "Zimbabwe", code: "+263", isoCode: "ZW" },
];

const FEE_PERCENTAGE = 0.0199; // 1.99%

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const fetchExchangeRate = async (currency) => {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD`
    );
    const data = await response.json();

    if (data && data.rates && data.rates[currency]) {
      return 1 / data.rates[currency];
    }

    return null;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};

const convertToUsd = async (amount, currency) => {
  if (currency === "USD") return amount;

  const rate = await fetchExchangeRate(currency);
  if (rate === null) return null;

  return amount * rate;
};

const calculateFee = (amount) => {
  return amount * FEE_PERCENTAGE;
};

// Main component
const StandalonePaymentForm = ({
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
  const [usdAmount, setUsdAmount] = useState(null);
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
  const [error, setError] = useState(null);
  const [countryCode, setCountryCode] = useState("+234");

  // Fetch USD amount on component mount
  useEffect(() => {
    const fetchUsdAmount = async () => {
      try {
        setLoading(true);
        const usdValue = await convertToUsd(amount, currency);

        if (usdValue !== null) {
          setUsdAmount(usdValue);
          setFormData((prev) => ({
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

  const handleSubmit = async (e) => {
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

      // Sign up user (continue even if it fails)
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
            gross_amount: formData.amount,
            currency: formData.currency,
            fees: formData.fees,
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

        return; // Stop further execution
      }

      // Handle failure cases
      console.log("Full API response:", result);
      const errorMessage =
        result?.message || result?.error || "Unknown error occurred";
      throw new Error(errorMessage);
    } catch (error) {
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // CSS classes
  const baseInputClasses =
    "w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400";
  const baseSelectClasses =
    "w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed";
  const baseButtonClasses =
    "w-full bg-purple-800 text-white py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:bg-purple-900 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none";

  // Add CSS styles for animations
  const styles = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes slideOut {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(-20px); opacity: 0; }
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    .animate-shake {
      animation: shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }

    .animate-slide-in {
      animation: slideIn 0.3s ease-out forwards;
    }

    .animate-slide-out {
      animation: slideOut 0.3s ease-in forwards;
    }

    .animate-pulse {
      animation: pulse 1.5s ease-in-out infinite;
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }

    .animate-slide-up {
      animation: slideUp 0.3s ease-out forwards;
    }

    .transform {
      transform-origin: center;
      transition-property: transform;
    }

    .hover\\:scale-\\[1\\.02\\]:hover {
      transform: scale(1.02);
    }

    .active\\:scale-\\[0\\.98\\]:active {
      transform: scale(0.98);
    }

    .transition-all {
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    .duration-300 {
      transition-duration: 300ms;
    }

    .duration-500 {
      transition-duration: 500ms;
    }
  `;

  // Modal overlay and content for step 1
  if (step === 1) {
    return (
      <>
        <style>{styles}</style>
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black bg-opacity-50 animate-fade-in overflow-y-auto">
          <div className="relative max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-500 animate-slide-up my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
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
                <label
                  htmlFor="signUpConsent"
                  className="text-sm text-gray-600"
                >
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
      </>
    );
  }

  // Modal overlay and content for step 2
  return (
    <>
      <style>{styles}</style>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black bg-opacity-50 animate-fade-in overflow-y-auto">
        <div className="relative max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-500 animate-slide-up my-8 max-h-[90vh] overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
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
                  {formData.fees.toFixed(3)} {formData.currency}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-gray-900">
                  {formatCurrency(formData.amount + formData.fees)}{" "}
                  {formData.currency}
                </span>
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

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-center">
                <div className="text-purple-800 font-medium mb-2">
                  USDT Amount to Pay
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  ${usdAmount ? formatCurrency(amount + formData.fees) : "..."}{" "}
                  USDT
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
                Send exactly $
                {usdAmount ? formatCurrency(usdAmount + formData.fees) : "..."}{" "}
                USDT to the store's wallet address on the Polygon network
              </p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <label
                  htmlFor="trxnHash"
                  className="block text-gray-900 font-medium"
                >
                  Transaction Hash
                </label>
                <div className="relative ml-2 group">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Transaction hash help"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </button>
                  <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-sm rounded p-2 shadow-lg w-64 -top-2 left-6">
                    <p>You can find your transaction hash:</p>
                    <ul className="mt-1 ml-4 list-disc">
                      <li>
                        In your wallet's transaction history after sending USDT
                      </li>
                      <li>From the transaction confirmation page</li>
                      <li>By checking your wallet's activity tab</li>
                    </ul>
                    <p className="mt-1">
                      It starts with "0x" followed by letters and numbers.
                    </p>
                  </div>
                </div>
              </div>
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
                  The payment session has expired. Please start over to generate
                  a new payment link.
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
    </>
  );
};

export default StandalonePaymentForm;
