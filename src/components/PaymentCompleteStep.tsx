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
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  error: string | null;
  effectiveWalletAddress: string | null | undefined;
  totalAmountDue: number;
  totalUsdAmountDue: number;
  processingFee: number;
  processingFeeUsd: number;
  copyToClipboard: (text: string | null | undefined) => void;
  handlePasteTransactionHash: () => Promise<void>;
  resetSession: () => void;
  storeError: string | null;
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
  processingFeeUsd,
  copyToClipboard,
  handlePasteTransactionHash,
  resetSession,
  storeError,
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
            className="block text-gray-900 mb-1 font-medium text-sm"
          >
            Transaction Hash <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="trxn_hash"
              name="trxn_hash"
              required
              className={`${baseInputClasses} pr-10`}
              value={formData.trxn_hash}
              onChange={handleInputChange}
              placeholder="0x..."
              disabled={loading || !effectiveWalletAddress}
            />
            {/* Paste Button */}
            {typeof navigator !== "undefined" && navigator.clipboard && (
              <button
                type="button"
                onClick={handlePasteTransactionHash}
                className={`absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={loading || !effectiveWalletAddress}
                title="Paste Transaction Hash"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M2 5a2 2 0 012-2h2a2 2 0 012 2v1H4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-4V5a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Enter or paste the transaction hash after sending the USDT payment.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            type="submit"
            className={baseButtonClasses}
            disabled={loading || !formData.trxn_hash || !effectiveWalletAddress}
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
                Processing Payment...
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
      </form>
    </div>
  );
};
