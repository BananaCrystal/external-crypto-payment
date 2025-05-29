import React from "react";
import { FormData } from "@/types/paymentTypes";
import { formatCurrency, formatTime } from "@/helpers/paymentHelpers"; // Assuming helpers are here
import {
  brandPurple,
  baseInputClasses,
  baseButtonClasses,
  secondaryButtonClasses,
} from "@/styles/paymentStyles";
import CryptoJS from "crypto-js";

interface PaymentCompleteStepProps {
  formData: Omit<FormData, "wallet_address">;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  effectiveWalletAddress: string | null;
  totalAmountDue: number;
  totalUsdAmountDue: number;
  processingFee: number;
  processingFeeUsd: number;
  description: string;
  copyToClipboard: (text: string | null | undefined) => void;
  handlePasteTransactionHash: () => void;
  resetSession: () => void;
  storeError: string | null;
  disabled?: boolean;
}

// Add decryption utility
const decryptApiKey = (encryptedKey: string): string => {
  const ENCRYPTION_KEY =
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "your-fallback-encryption-key";
  const bytes = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const PaymentCompleteStep: React.FC<PaymentCompleteStepProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  loading,
  error,
  effectiveWalletAddress,
  totalAmountDue,
  totalUsdAmountDue,
  processingFee,
  description,
  processingFeeUsd,
  copyToClipboard,
  handlePasteTransactionHash,
  resetSession,
  storeError,
  disabled,
}) => {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 text-center">
        Complete Payment
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

      {/* Description and Amount Summary with Fee */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Description:</span>
          <span className="font-bold text-gray-900">
            {description || "Secure cryptocurrency payment"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Original Amount:</span>
          <span className="font-bold text-gray-900">
            {formatCurrency(formData.amount)} {formData.currency}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Processing Fee:</span>
          <span className="font-bold text-gray-900">
            +{formatCurrency(processingFee)} {formData.currency}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3 mt-2">
          <span className="text-gray-900">Total Amount Due:</span>
          <span className="text-gray-900">
            {formatCurrency(totalAmountDue)} {formData.currency}
          </span>
        </div>
      </div>

      {/* Wallet Address Section */}
      <div className="bg-gray-100 rounded-2xl p-6 sm:p-8 border border-gray-200 text-gray-900 shadow-inner mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg sm:text-xl text-gray-800">
            Send Payment To This Address
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard(effectiveWalletAddress)}
            className={`bg-[#4c3f84] hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center transition`}
            disabled={!effectiveWalletAddress || loading}
          >
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
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            Copy
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-300">
          <p className="font-mono text-base sm:text-lg break-words text-green-600 select-all">
            {effectiveWalletAddress || "Wallet address unavailable."}
          </p>
        </div>

        <p className="text-sm sm:text-base font-bold text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mt-4 text-center shadow-sm">
          Polygon/MATIC Network Only
        </p>

        {/* USDT Amount to Pay */}
        <div className={`bg-[#4c3f84] rounded-lg p-4 sm:p-5 mt-4 text-white`}>
          <div className="text-center">
            <div className="font-medium mb-1 text-purple-200">
              Total USDT Amount to Pay
            </div>
            <div className="text-2xl font-bold text-white">
              ${formatCurrency(totalUsdAmountDue.toFixed(2))} USDT
            </div>
          </div>
        </div>
      </div>

      {/* Form for Step 2 */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Transaction Hash Input with Paste Button */}
        <div>
          <label
            htmlFor="trxn_hash"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Transaction Hash
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="trxn_hash"
              name="trxn_hash"
              value={formData.trxn_hash}
              onChange={handleInputChange}
              placeholder="Enter your transaction hash"
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400 text-sm ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading || disabled}
            />
            <button
              type="button"
              onClick={handlePasteTransactionHash}
              className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2 ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading || disabled}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Paste
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading || !formData.trxn_hash || disabled}
            className={`w-full bg-[#4c3f84] text-white py-3 rounded-lg transition-all duration-300 ${
              loading || !formData.trxn_hash || disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90 transform hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                Processing...
              </div>
            ) : (
              "Submit Payment"
            )}
          </button>

          <button
            type="button"
            onClick={resetSession}
            className={secondaryButtonClasses}
            disabled={loading}
          >
            Cancel & Start Over
          </button>
        </div>

        {/* Add a message when the form is disabled */}
        {disabled && (
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> Payment window has expired. Please request more
              time to proceed.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
