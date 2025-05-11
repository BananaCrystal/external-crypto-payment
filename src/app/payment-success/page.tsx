"use client";

import { useSearchParams } from "next/navigation";
import PaymentSuccess from "@/components/PaymentSuccess";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || undefined;

  return <PaymentSuccess redirectUrl={redirectUrl} />;
}
