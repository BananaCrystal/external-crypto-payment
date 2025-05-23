import React from "react";
import { FormData, StoreDetails, CrmDetails } from "@/types/paymentTypes";
import { formatCurrency } from "@/helpers";
import { COUNTRY_CODES } from "@/constants/countries";
import {
  baseInputClasses,
  baseSelectClasses,
  baseButtonClasses,
} from "@/styles/paymentStyles";

interface PaymentDetailsStepProps {
  formData: Omit<FormData, "wallet_address">;
  setFormData: React.Dispatch<
    React.SetStateAction<Omit<FormData, "wallet_address">>
  >;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  countryCode: string;
  setCountryCode: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>; // Pass the submit handler down
  loading: boolean;
  error: string | null;
  canProceedToPayment: boolean; // Whether a payment address is available
  totalAmountDue: number; // Calculated fees
  totalUsdAmountDue: number; // Calculated fees
  processingFee: number; // Calculated fee amount
  storeError: string | null; // Store API fetch error (for warning message)
  effectiveWalletAddress: string | null | undefined; // Needed for warning message condition
}

export const PaymentDetailsStep: React.FC<PaymentDetailsStepProps> = ({
  formData,
  setFormData,
  handleInputChange,
  countryCode,
  setCountryCode,
  handleSubmit,
  loading,
  error,
  canProceedToPayment,
  totalAmountDue,
  totalUsdAmountDue,
  processingFee,
  storeError,
  effectiveWalletAddress,
}) => {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 text-center">
        Payment Details
      </h2>

      {error && (
        <div className="bg-red-50 rounded-lg p-4 mb-4 animate-shake">
          <p className="text-red-800 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </p>
        </div>
      )}
      {/* Show store API fetch error if it occurred, but form is still rendering due to fallback */}
      {storeError && effectiveWalletAddress && (
        <div className="bg-yellow-50 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm flex items-center gap-2">
            <span>⚠️</span> Could not load all store details (e.g., logo,
            support email), but payment address is available from the link.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Amount Details Summary with Fee */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Original Amount:</span>
            <span className="font-bold text-gray-900">
              {formatCurrency(formData.amount)} {formData.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Processing Fee 1.99%:</span>
            <span className="font-bold text-gray-900">
              +{formatCurrency(processingFee)} {formData.currency}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
            <span className="text-gray-900">Total Amount Due:</span>
            <span className="text-gray-900">
              {formatCurrency(totalAmountDue)} {formData.currency}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span className="text-gray-600">USD Equivalent Due:</span>
            <span className="text-[#4c3f84]">
              ${formatCurrency(totalUsdAmountDue.toFixed(2))} USDT
            </span>
          </div>
        </div>

        {/* Input Fields */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-gray-900 mb-1 font-medium text-sm"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className={baseInputClasses}
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-gray-900 mb-1 font-medium text-sm"
          >
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className={baseInputClasses}
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-gray-900 mb-1 font-medium text-sm"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={baseInputClasses}
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-gray-900 mb-1 font-medium text-sm"
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className={`${baseSelectClasses} rounded-r-none border-r-0 w-24`}
              disabled={loading}
            >
              {COUNTRY_CODES.map((country, index) => (
                <option
                  key={`${country.code}-${country.country}`}
                  value={country.code}
                >
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
              placeholder="8012345678"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="street"
            className="block text-gray-900 mb-1 font-medium text-sm"
          >
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="street"
            name="street"
            required
            className={baseInputClasses}
            value={formData.street}
            onChange={handleInputChange}
            placeholder="123 Main St"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block text-gray-900 mb-1 font-medium text-sm"
            >
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              className={baseInputClasses}
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-gray-900 mb-1 font-medium text-sm"
            >
              State/Province
            </label>
            <input
              type="text"
              id="state"
              name="state"
              className={baseInputClasses}
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="postalCode"
              className="block text-gray-900 mb-1 font-medium text-sm"
            >
              Postal/ZIP Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              className={baseInputClasses}
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="Postal Code"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-gray-900 mb-1 font-medium text-sm"
            >
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              name="country"
              required
              className={baseSelectClasses}
              value={formData.country}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="" disabled>
                Select Country
              </option>
              {COUNTRY_CODES.map((country) => (
                <option key={country.country} value={country.country}>
                  {country.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className={baseButtonClasses}
          disabled={loading || !canProceedToPayment}
        >
          Payment Details →
        </button>
        {!canProceedToPayment && (
          <p className="text-red-500 text-center text-sm mt-2">
            Cannot proceed to payment: Payment address unavailable.
          </p>
        )}
      </form>
    </div>
  );
};
