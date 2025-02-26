import React, { useState } from 'react';
import { PaymentForm, CURRENCIES } from 'banana-crystal-payment';

function ExampleApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState({
    storeId: 'your-store-id',
    amount: 5000,
    currency: 'NGN',
    description: 'Product Purchase',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    redirectUrl: 'https://your-store.com/success',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentConfig({
      ...paymentConfig,
      [name]: name === 'amount' ? parseFloat(value) : value,
    });
  };

  const handleSuccess = (data) => {
    console.log('Payment successful:', data);
    alert('Payment successful!');
    setIsModalOpen(false);
  };

  const handleError = (error) => {
    console.error('Payment failed:', error);
    alert(`Payment failed: ${error.message}`);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Configure Payment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Store ID</label>
            <input
              type="text"
              name="storeId"
              value={paymentConfig.storeId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={paymentConfig.amount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Currency</label>
            <select
              name="currency"
              value={paymentConfig.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={paymentConfig.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Wallet Address</label>
            <input
              type="text"
              name="walletAddress"
              value={paymentConfig.walletAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Redirect URL (Optional)</label>
            <input
              type="text"
              name="redirectUrl"
              value={paymentConfig.redirectUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            onClick={handleOpenModal}
            className="bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-900 transition-colors"
          >
            Open Payment Modal
          </button>
        </div>
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

export default ExampleApp;
