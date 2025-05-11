"use client";

import { PaymentForm } from "../../components";
import { useSearchParams } from "next/navigation";

interface SearchParams {
  store_id: string;
  amount: string;
  currency: string;
  description: string;
  usd_amount: string;
  redirect_url?: string;
  wallet_address?: string;
  gohighlevel_enabled?: string;
  gohighlevel_api_key?: string;
  gohighlevel_tags?: string;
  product_name?: string;
}

function validateParams(params: SearchParams) {
  const errors = [];

  if (!params.store_id) errors.push("Store ID is required");
  if (!params.amount || isNaN(parseFloat(params.amount)))
    errors.push("Valid amount is required");
  if (!params.description) errors.push("Description is required");
  if (!params.usd_amount || isNaN(parseFloat(params.usd_amount)))
    errors.push("Valid USD amount is required");

  return errors;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();

  // Extract all parameters from the URL using the hook
  const params = {
    storeId: searchParams.get("store_id") || "",
    amount: parseFloat(searchParams.get("amount") || "0"),
    currency: searchParams.get("currency") || "",
    description: searchParams.get("description") || "",
    usd_amount: parseFloat(searchParams.get("usd_amount") || "0"),
    redirect_url: searchParams.get("redirect_url") || undefined,
    walletAddressFromParams: searchParams.get("wallet_address") || undefined,
    gohighlevelApiKey: searchParams.get("gohighlevel_api_key") || undefined,
    productName: searchParams.get("product_name") || undefined,
  };

  // Validate required parameters
  if (
    !params.storeId ||
    !params.amount ||
    !params.description ||
    !params.usd_amount
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 py-12 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
          <p className="text-red-600 mb-4">
            ⚠️ Missing required parameters
            <span className="block mt-2">
              The payment link is missing required information. Please check the
              URL and try again.
            </span>
          </p>
          <p className="text-gray-600 text-sm">
            Required parameters: store_id, amount, description, usd_amount
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <PaymentForm
          storeId={params.storeId}
          amount={params.amount}
          currency={params.currency}
          description={params.description}
          usd_amount={params.usd_amount}
          redirect_url={params.redirect_url}
          walletAddressFromParams={params.walletAddressFromParams}
          gohighlevelApiKey={params.gohighlevelApiKey}
          productName={params.productName}
        />
      </div>
    </div>
  );
}
