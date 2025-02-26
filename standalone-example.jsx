"use client";

import React, { useState } from 'react';
import StandalonePaymentForm from './standalone-payment-form';

export default function PaymentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState('center');
  const [modalSize, setModalSize] = useState('default');
  const [themeColor, setThemeColor] = useState('purple');
  
  const [paymentConfig] = useState({
    storeId: 'your-store-id',
    amount: 5000,
    currency: 'NGN',
    description: 'Product Purchase',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    redirectUrl: 'https://your-store.com/success',
  });

  // Theme color presets
  const themePresets = {
    blue: {
      primaryColor: 'blue-600',
      secondaryColor: 'blue-50',
      textColor: 'gray-900',
      backgroundColor: 'white',
    },
    purple: {
      primaryColor: 'purple-800',
      secondaryColor: 'purple-50',
      textColor: 'gray-900',
      backgroundColor: 'white',
    },
    green: {
      primaryColor: 'green-600',
      secondaryColor: 'green-50',
      textColor: 'gray-900',
      backgroundColor: 'white',
    },
    dark: {
      primaryColor: 'gray-800',
      secondaryColor: 'gray-700',
      textColor: 'gray-100',
      backgroundColor: 'gray-900',
    },
  };

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
      <h1 className="text-2xl font-bold mb-4">Standalone Payment Form Example</h1>
      
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
        
        {/* Modal Customization Options */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Modal Customization</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <select 
                value={modalPosition}
                onChange={(e) => setModalPosition(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <select 
                value={modalSize}
                onChange={(e) => setModalSize(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="small">Small</option>
                <option value="default">Default</option>
                <option value="large">Large</option>
                <option value="full">Full Width</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Theme</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(themePresets).map((color) => (
                <button
                  key={color}
                  onClick={() => setThemeColor(color)}
                  className={`px-3 py-1 rounded ${
                    themeColor === color 
                      ? `bg-${themePresets[color].primaryColor} text-white` 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleOpenModal}
          className={`w-full bg-${themePresets[themeColor].primaryColor} text-white py-3 rounded-lg hover:bg-${themePresets[themeColor].primaryColor.replace(/(-\d+)$/, (m) => `-${parseInt(m.substring(1)) + 100}`)} transition-colors`}
        >
          Proceed to Payment
        </button>
      </div>
      
      {/* Payment Modal */}
      <StandalonePaymentForm
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
        modalPosition={modalPosition}
        modalSize={modalSize}
        theme={themePresets[themeColor]}
      />
    </div>
  );
}
