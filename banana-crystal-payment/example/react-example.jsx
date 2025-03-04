import React from 'react';
import { PaymentForm } from 'banana-crystal-payment';

const ExampleApp = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleSuccess = (result) => {
    console.log('Payment successful:', result);
    // Handle successful payment
  };
  
  const handleError = (error) => {
    console.error('Payment error:', error);
    // Handle payment error
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Banana Crystal Payment Example</h1>
      
      <button 
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        onClick={() => setIsOpen(true)}
      >
        Open Payment Form
      </button>
      
      <PaymentForm
        storeId="your-store-id"
        amount={100}
        currency="USD"
        description="Payment for Product XYZ"
        walletAddress="0x1234567890abcdef1234567890abcdef12345678"
        redirectUrl="https://example.com/thank-you"
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
};

export default ExampleApp;
