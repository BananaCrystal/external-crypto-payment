"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PaymentSuccess from "@/components/PaymentSuccess";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || undefined;

  return <PaymentSuccess redirectUrl={redirectUrl} />;
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
