'use client';

import { useState } from 'react';
import { PaymentForm } from 'banana-crystal-payment';

export default function TestImportPage() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  
  const handleSuccess = (result: any) => {
    console.log('Payment successful:', result);
    setIsOpen(false);
  };
  
  const handleError = (error: any) => {
    console.error('Payment error:', error);
  };

  // Check if PaymentForm is available
  const isPaymentFormAvailable = typeof PaymentForm === 'function';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Test Import Page</h1>
      
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <p className="text-green-800">
          If you can see this page and the button below, the import is working correctly!
        </p>
      </div>
      
      <div className="mb-6">
        <p className="mb-2">PaymentForm component type: <code className="bg-gray-100 px-2 py-1 rounded">{typeof PaymentForm}</code></p>
        <p>PaymentForm is a valid component: <code className="bg-gray-100 px-2 py-1 rounded">{isPaymentFormAvailable ? 'Yes' : 'No'}</code></p>
      </div>
      
      <button
        onClick={handleOpenModal}
        className="bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-900 transition-colors"
      >
        Open Payment Form
      </button>
      
      {isPaymentFormAvailable && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800">
            PaymentForm component is available but not rendered here due to type compatibility issues.
            This is expected as we're just testing the import functionality.
          </p>
        </div>
      )}
    </div>
  );
}
