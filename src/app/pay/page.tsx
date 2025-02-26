"use client";

import { PaymentForm } from "../../components";
import { useSearchParams } from "next/navigation";

interface SearchParams {
  store_id?: string;
  amount?: string;
  currency?: string;
  description?: string;
  usd_amount?: string;
  redirect_url?: string;
  wallet_address?: string;
}

function validateParams(params: SearchParams) {
  const errors = [];

  if (!params.store_id) errors.push("Store ID is required");
  if (!params.amount || isNaN(parseFloat(params.amount)))
    errors.push("Valid amount is required");
  if (!params.description) errors.push("Description is required");
  if (!params.usd_amount || isNaN(parseFloat(params.usd_amount)))
    errors.push("Valid USD amount is required");
  if (!params.wallet_address) errors.push("Wallet address is required");

  return errors;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const params = {
    store_id: searchParams.get("store_id") || "",
    amount: searchParams.get("amount") || "",
    currency: searchParams.get("currency") || "",
    description: searchParams.get("description") || "",
    usd_amount: searchParams.get("usd_amount") || "",
    redirect_url: searchParams.get("redirect_url") || "",
    wallet_address: searchParams.get("wallet_address") || "",
  };
  const errors = validateParams(params);

  if (errors.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            <span className="inline-block animate-bounce">⚠️</span> Invalid
            Payment URL
          </h2>
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <ul className="list-disc list-inside space-y-1 text-red-700">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
          <p className="text-gray-600 mb-4">
            Please ensure your payment URL includes all required parameters:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>
              <code className="text-purple-700">store_id</code>: Your store
              identifier
            </li>
            <li>
              <code className="text-purple-700">amount</code>: Payment amount
            </li>
            <li>
              <code className="text-purple-700">currency</code>: Payment
              currency (default: NGN)
            </li>
            <li>
              <code className="text-purple-700">description</code>: Payment
              description
            </li>
            <li>
              <code className="text-purple-700">usd_amount</code>: Amount in USD
            </li>
            <li>
              <code className="text-purple-700">wallet_address</code>: USDT
              wallet address (Polygon)
            </li>
            <li>
              <code className="text-purple-700">redirect_url</code>: (Optional)
              URL to redirect after payment
            </li>
          </ul>
          <div className="mt-6 bg-purple-50 rounded-lg p-4">
            <p className="font-medium text-purple-800 mb-2">Example URL:</p>
            <p className="text-sm font-mono break-all text-purple-600">
              /pay?store_id=store123&amount=5000&currency=NGN&description=Product%20Purchase&usd_amount=10.50&wallet_address=0x1234...&redirect_url=https://your-store.com/success
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <PaymentForm
          storeId={params.store_id!}
          amount={parseFloat(params.amount!)}
          currency={params.currency || "USD"}
          description={params.description!}
          usd_amount={parseFloat(params.usd_amount!)}
          wallet_address={params.wallet_address!}
          redirect_url={params.redirect_url}
        />
      </div>
    </div>
  );
}
