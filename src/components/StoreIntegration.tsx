"use client";

import { CURRENCIES } from "@/constants/countries";
import { formatCurrency } from "@/helpers";
import { useState, useEffect } from "react";
import { LogoComponent } from "./LogoComponent";

interface StoreDetails {
  store_id: string;
  wallet_address: string;
  amount: string;
  currency: string;
  description: string;
  redirect_url: string;
  crm: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    listId: string;
    tagIncomplete: string;
    tagComplete: string;
  };
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
    crm: {
      enabled: false,
      provider: "mailchimp",
      apiKey: "",
      listId: "",
      tagIncomplete: "payment_initiated",
      tagComplete: "payment_completed",
    },
  });
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [usdAmount, setUsdAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCrmSettings, setShowCrmSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("payment");

  useEffect(() => {
    const fetchRate = async () => {
      if (!formData.amount || !formData.currency) return;

      try {
        setLoading(true);
        setError(null);

        // ExchangeRate-API (free tier)
        const response = await fetch(`https://open.er-api.com/v6/latest/USD`);
        const data = await response.json();

        if (data.rates && data.rates[formData.currency]) {
          // ExchangeRate-API returns rates relative to base currency (USD)
          const exchangeRate = data.rates[formData.currency];
          // Calculate the banana crystal rate (assuming original rate was USD to target currency)
          const bananaCrystalRate = exchangeRate;

          const amountInUsd = parseFloat(formData.amount) / bananaCrystalRate;
          setUsdAmount(amountInUsd);
        } else {
          setError(`Currency ${formData.currency} not supported.`);
          setUsdAmount(null);
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

    // Build URL parameters
    const params = new URLSearchParams({
      store_id: formData.store_id,
      amount: formData.amount,
      currency: formData.currency,
      description: formData.description,
      redirect_url: formData.redirect_url,
      usd_amount: usdAmount.toFixed(2),
      wallet_address: formData.wallet_address,
    });

    // Add CRM details if enabled
    if (formData.crm.enabled) {
      params.append("crm_enabled", "true");
      params.append("crm_provider", formData.crm.provider);
      params.append("crm_api_key", formData.crm.apiKey);
      params.append("crm_list_id", formData.crm.listId);
      params.append("crm_tag_incomplete", formData.crm.tagIncomplete);
      params.append("crm_tag_complete", formData.crm.tagComplete);
    }

    const link = `${baseUrl}/pay?${params.toString()}`;
    setGeneratedLink(link);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("crm.")) {
      const crmField = name.split(".")[1];
      setFormData({
        ...formData,
        crm: {
          ...formData.crm,
          [crmField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCrmToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      crm: {
        ...formData.crm,
        enabled: e.target.checked,
      },
    });

    if (e.target.checked) {
      setShowCrmSettings(true);
    }
  };

  const baseInputClasses =
    "w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400";
  const baseSelectClasses =
    "w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white";
  const tabClasses =
    "px-4 py-2 font-medium text-sm rounded-lg transition-all duration-200";
  const activeTabClasses = `${tabClasses} bg-purple-800 text-white`;
  const inactiveTabClasses = `${tabClasses} text-gray-600 hover:bg-gray-100`;

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-500">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
        Generate Payment Link
      </h2>

      <div className="bg-purple-50 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💳</span>
          <p className="text-gray-900">
            Enter your store details and payment information to generate a
            custom payment link for your customers.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          className={
            activeTab === "payment" ? activeTabClasses : inactiveTabClasses
          }
          onClick={() => setActiveTab("payment")}
        >
          Payment Settings
        </button>
        <button
          className={
            activeTab === "integration" ? activeTabClasses : inactiveTabClasses
          }
          onClick={() => setActiveTab("integration")}
        >
          CRM Integration
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === "payment" && (
          <>
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
                Your USDT wallet address on the Polygon network where payments
                will be sent
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
                  <span className="font-bold">
                    ${formatCurrency(usdAmount.toFixed(2))}
                  </span>
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable_crm"
                name="enable_crm"
                checked={formData.crm.enabled}
                onChange={handleCrmToggle}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="enable_crm" className="ml-2 text-gray-900">
                Enable CRM Integration
              </label>
              <button
                type="button"
                onClick={() => setActiveTab("integration")}
                className="ml-auto text-purple-600 text-sm"
              >
                Configure CRM →
              </button>
            </div>
          </>
        )}

        {activeTab === "integration" && (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-yellow-600 text-xl">ℹ️</span>
                <div>
                  <p className="text-yellow-800 font-medium">CRM Integration</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Connect your CRM system to automatically send customer data
                    before and after payment. Customer details will be tagged
                    differently for initiated vs. completed payments.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="crm_enabled"
                name="crm.enabled"
                checked={formData.crm.enabled}
                onChange={handleCrmToggle}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <label
                htmlFor="crm_enabled"
                className="ml-2 text-gray-900 font-medium"
              >
                Enable CRM Integration
              </label>
            </div>

            {formData.crm.enabled && (
              <>
                <div>
                  <label
                    htmlFor="crm_provider"
                    className="block text-gray-900 mb-2 font-medium"
                  >
                    CRM Provider
                  </label>
                  <select
                    id="crm_provider"
                    name="crm.provider"
                    value={formData.crm.provider}
                    required={formData.crm.enabled}
                    className={baseSelectClasses}
                    onChange={handleInputChange}
                  >
                    <option value="mailchimp">Mailchimp</option>
                    <option value="sendy">Sendy</option>
                    <option value="convertkit">ConvertKit</option>
                    <option value="activecampaign">ActiveCampaign</option>
                    <option value="hubspot">HubSpot</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="crm_api_key"
                    className="block text-gray-900 mb-2 font-medium"
                  >
                    API Key
                  </label>
                  <input
                    type="password"
                    id="crm_api_key"
                    name="crm.apiKey"
                    value={formData.crm.apiKey}
                    required={formData.crm.enabled}
                    className={baseInputClasses}
                    onChange={handleInputChange}
                    placeholder="Your CRM API key"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    The API key for your CRM account (stored securely)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="crm_list_id"
                    className="block text-gray-900 mb-2 font-medium"
                  >
                    List/Audience ID
                  </label>
                  <input
                    type="text"
                    id="crm_list_id"
                    name="crm.listId"
                    value={formData.crm.listId}
                    required={formData.crm.enabled}
                    className={baseInputClasses}
                    onChange={handleInputChange}
                    placeholder="e.g., abc123def456"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    The ID of the list or audience where contacts will be added
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="crm_tag_incomplete"
                      className="block text-gray-900 mb-2 font-medium"
                    >
                      Initiated Payment Tag
                    </label>
                    <input
                      type="text"
                      id="crm_tag_incomplete"
                      name="crm.tagIncomplete"
                      value={formData.crm.tagIncomplete}
                      className={baseInputClasses}
                      onChange={handleInputChange}
                      placeholder="payment_initiated"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Tag for started but incomplete payments
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="crm_tag_complete"
                      className="block text-gray-900 mb-2 font-medium"
                    >
                      Completed Payment Tag
                    </label>
                    <input
                      type="text"
                      id="crm_tag_complete"
                      name="crm.tagComplete"
                      value={formData.crm.tagComplete}
                      className={baseInputClasses}
                      onChange={handleInputChange}
                      placeholder="payment_completed"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Tag for successfully completed payments
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <span className="font-medium">Data sent to CRM:</span> First
                    name, last name, email, phone, address, payment amount,
                    currency, and status. The customer will be tagged with{" "}
                    {formData.crm.tagIncomplete} when they start the payment
                    process and {formData.crm.tagComplete} when payment is
                    confirmed.
                  </p>
                </div>
              </>
            )}

            <button
              type="button"
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg transition-all duration-300 hover:bg-gray-300"
              onClick={() => setActiveTab("payment")}
            >
              Back to Payment Settings
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg animate-shake">
            <p className="text-red-800 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </p>
          </div>
        )}

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

                // Show toast notification
                const toast = document.createElement("div");
                toast.className =
                  "fixed top-4 right-4 bg-purple-50 text-purple-800 p-4 rounded-lg shadow-lg z-50 animate-slide-in";
                toast.innerHTML = `
                  <div class="flex items-center gap-2">
                    <span>📋</span>
                    <p>Payment link copied to clipboard!</p>
                  </div>
                `;
                document.body.appendChild(toast);

                // Remove toast after 2 seconds
                setTimeout(() => {
                  toast.classList.add("animate-slide-out");
                  setTimeout(() => toast.remove(), 300);
                }, 2000);
              }}
              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium bg-white py-2 px-4 rounded border border-purple-200 hover:border-purple-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Link
            </button>
          </div>
          <div className="font-mono text-sm break-all text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
            {generatedLink}
          </div>

          <div className="mt-4 flex gap-4">
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Preview Link
            </a>
            <button
              onClick={() => {
                const testParams = new URLSearchParams(
                  generatedLink.split("?")[1]
                );
                const testUrl = `${
                  window.location.origin
                }/test-payment?${testParams.toString()}`;
                window.open(testUrl, "_blank");
              }}
              className="flex-1 bg-gray-700 text-white text-center py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Test Payment Flow
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-center items-center opacity-80 hover:opacity-100 transition-opacity">
          <span className="text-gray-500 text-sm mr-2">Powered by</span>
          <a
            href="https://bananacrystal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <LogoComponent />
          </a>
        </div>
      </div>
    </div>
  );
}
