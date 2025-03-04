import React from 'react';
import { PaymentForm } from 'banana-crystal-payment';

export default function PaymentPage() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleSuccess = (result) => {
    console.log('Payment successful:', result);
    // Handle successful payment, e.g., redirect to thank you page
    // router.push('/thank-you');
  };
  
  const handleError = (error) => {
    console.error('Payment error:', error);
    // Handle payment error, e.g., show error message
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Product:</span>
          <span>Premium Subscription</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Price:</span>
          <span>$100.00 USD</span>
        </div>
        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
          <span>Total:</span>
          <span>$100.00 USD</span>
        </div>
      </div>
      
      <button 
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        Pay with Crypto
      </button>
      
      <PaymentForm
        storeId={process.env.NEXT_PUBLIC_STORE_ID || "your-store-id"}
        amount={100}
        currency="USD"
        description="Premium Subscription"
        walletAddress={process.env.NEXT_PUBLIC_WALLET_ADDRESS || "0x1234567890abcdef1234567890abcdef12345678"}
        redirectUrl="/thank-you"
        onSuccess={handleSuccess}
        onError={handleError}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        modalPosition="center"
        modalSize="default"
        theme={{
          primaryColor: "purple-800",
          secondaryColor: "blue-50",
          textColor: "gray-900",
          backgroundColor: "white"
        }}
      />
    </div>
  );
}
