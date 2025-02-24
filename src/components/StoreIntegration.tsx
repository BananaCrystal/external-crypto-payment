"use client";

import { CURRENCIES } from "@/constants";
import { useState, useEffect } from "react";

interface StoreDetails {
  store_id: string;
  wallet_address: string;
  amount: string;
  currency: string;
  description: string;
  redirect_url: string;
}

interface Rate {
  fromCurrency: string;
  toCurrency: string;
  bananaCrystalRate: number;
  confidence: number;
}

export default function StoreIntegration() {
  const [formData, setFormData] = useState<StoreDetails>({
    store_id: "",
    wallet_address: "",
    amount: "",
    currency: "NGN",
    description: "",
    redirect_url: "",
  });
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [usdAmount, setUsdAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("+234");

  useEffect(() => {
    const fetchRate = async () => {
      if (!formData.amount || !formData.currency) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://fxrateservice.vercel.app/api/bananacrystal-rate?from=USD&to=${formData.currency}`
        );
        const data: Rate = await response.json();

        if (data.bananaCrystalRate) {
          const amountInUsd =
            parseFloat(formData.amount) / data.bananaCrystalRate;
          setUsdAmount(amountInUsd);
        }
      } catch (err) {
        setError("Failed to fetch currency rate. Please try again.");
        setUsdAmount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [formData.amount, formData.currency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!usdAmount) {
      setError("Please wait for currency conversion to complete");
      return;
    }

    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      store_id: formData.store_id,
      amount: formData.amount,
      currency: formData.currency,
      description: formData.description,
      redirect_url: formData.redirect_url,
      usd_amount: usdAmount.toFixed(2),
      wallet_address: formData.wallet_address,
    });

    const link = `${baseUrl}/pay?${params.toString()}`;
    setGeneratedLink(link);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const baseInputClasses =
    "w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400";
  const baseSelectClasses =
    "w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white";

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-500">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        Generate Payment Link
      </h2>

      <div className="bg-purple-50 rounded-lg p-6 mb-8">
        <p className="text-gray-900">
          Enter your store details and payment information to generate a payment
          link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="store_id"
            className="block text-gray-900 mb-2 font-medium"
          >
            Store ID
          </label>
          <input
            type="text"
            id="store_id"
            name="store_id"
            value={formData.store_id}
            required
            className={baseInputClasses}
            onChange={handleInputChange}
            placeholder="your-store-id"
          />
          <p className="text-sm text-gray-500 mt-1">
            Your unique store identifier
          </p>
        </div>

        <div>
          <label
            htmlFor="wallet_address"
            className="block text-gray-900 mb-2 font-medium"
          >
            Store USDT Wallet Address (Polygon)
          </label>
          <input
            type="text"
            id="wallet_address"
            name="wallet_address"
            value={formData.wallet_address}
            required
            className={baseInputClasses}
            onChange={handleInputChange}
            placeholder="0x..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Your USDT wallet address on the Polygon network where payments will
            be sent
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-gray-900 mb-2 font-medium"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              required
              min="1"
              step="any"
              className={baseInputClasses}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              htmlFor="currency"
              className="block text-gray-900 mb-2 font-medium"
            >
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              required
              className={baseSelectClasses}
              onChange={handleInputChange}
              value={formData.currency}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {usdAmount && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">
              Equivalent in USD:{" "}
              <span className="font-bold">${usdAmount.toFixed(2)}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg animate-shake">
            <p className="text-red-800 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="description"
            className="block text-gray-900 mb-2 font-medium"
          >
            Payment Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            required
            className={baseInputClasses}
            onChange={handleInputChange}
            placeholder="e.g., Product Purchase"
          />
        </div>

        <div>
          <label
            htmlFor="redirect_url"
            className="block text-gray-900 mb-2 font-medium"
          >
            Redirect URL (Optional)
          </label>
          <input
            type="url"
            id="redirect_url"
            name="redirect_url"
            value={formData.redirect_url}
            className={baseInputClasses}
            onChange={handleInputChange}
            placeholder="https://your-store.com/success"
          />
          <p className="text-sm text-gray-500 mt-1">
            URL to redirect after successful payment
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-800 text-white py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:bg-purple-900 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          disabled={loading}
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
              Calculating...
            </span>
          ) : (
            "Generate Payment Link"
          )}
        </button>
      </form>

      {generatedLink && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Your Payment Link</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedLink);
                alert("Payment link copied to clipboard!");
              }}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              Copy Link
            </button>
          </div>
          <div className="font-mono text-sm break-all text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
            {generatedLink}
          </div>
        </div>
      )}
    </div>
  );
}
