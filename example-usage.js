// This is a simple example to demonstrate how to import and use the PaymentForm component
// in a React application.

// CommonJS import
const React = require('react');
const { PaymentForm } = require('banana-crystal-payment');

// Example React component using the PaymentForm
function CheckoutPage() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  
  const handleSuccess = (result) => {
    console.log('Payment successful:', result);
    setIsOpen(false);
  };
  
  const handleError = (error) => {
    console.error('Payment error:', error);
  };
  
  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement(
      'button',
      { onClick: handleOpenModal },
      'Pay Now'
    ),
    React.createElement(PaymentForm, {
      storeId: 'your-store-id',
      amount: 100,
      currency: 'USD',
      description: 'Product Purchase',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      redirectUrl: 'https://example.com/success',
      onSuccess: handleSuccess,
      onError: handleError,
      isOpen: isOpen,
      onClose: handleCloseModal
    })
  );
}

// Log the PaymentForm component to verify it's imported correctly
console.log('PaymentForm component:', PaymentForm);
console.log('PaymentForm is a function:', typeof PaymentForm === 'function');

// Export the example component
module.exports = CheckoutPage;
