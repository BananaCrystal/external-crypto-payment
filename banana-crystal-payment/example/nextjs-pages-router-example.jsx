import React, { useState } from 'react';
import { PaymentForm } from 'banana-crystal-payment';

export default function PaymentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentConfig] = useState({
    storeId: 'your-store-id',
    amount: 5000,
    currency: 'NGN',
    description: 'Product Purchase',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    redirectUrl: 'https://your-store.com/success',
  });

  const handleSuccess = (data) => {
    console.log('Payment successful:', data);
    setIsModalOpen(false);
  };

  const handleError = (error) => {
    console.error('Payment failed:', error);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Next.js Pages Router Example</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Product:</span>
          <span>{paymentConfig.description}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Amount:</span>
          <span>{paymentConfig.amount} {paymentConfig.currency}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Fee (1.99%):</span>
          <span>{(paymentConfig.amount * 0.0199).toFixed(2)} {paymentConfig.currency}</span>
        </div>
        <div className="flex justify-between font-bold mb-6">
          <span>Total:</span>
          <span>{(paymentConfig.amount * 1.0199).toFixed(2)} {paymentConfig.currency}</span>
        </div>
        
        <button 
          onClick={handleOpenModal}
          className="w-full bg-purple-800 text-white py-3 rounded-lg hover:bg-purple-900 transition-colors"
        >
          Proceed to Payment
        </button>
      </div>
      
      {/* Payment Modal */}
      <PaymentForm
        storeId={paymentConfig.storeId}
        amount={paymentConfig.amount}
        currency={paymentConfig.currency}
        description={paymentConfig.description}
        walletAddress={paymentConfig.walletAddress}
        redirectUrl={paymentConfig.redirectUrl}
        onSuccess={handleSuccess}
        onError={handleError}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
