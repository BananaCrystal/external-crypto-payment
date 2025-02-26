# Banana Crystal Payment

A React component library for integrating USDT payments with BananaCrystal.

## Installation

Make sure to install the package along with its peer dependencies:

```bash
npm install banana-crystal-payment react react-dom
# or
yarn add banana-crystal-payment react react-dom
```

## Usage

### Importing the Component

Import the component using named imports:

```jsx
// Named import
import { PaymentForm } from 'banana-crystal-payment';
```

> **Note for Next.js App Router Users**: If you're using Next.js with the App Router, make sure to use the component with the "use client" directive:
>
> ```jsx
> "use client";
> 
> import { PaymentForm } from 'banana-crystal-payment';
> ```

### Modal Usage (Recommended)

The PaymentForm component is designed to work as a modal that pops up when needed:

```jsx
import React, { useState } from 'react';
import { PaymentForm } from 'banana-crystal-payment';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  return (
    <div className="container">
      <button onClick={handleOpenModal}>
        Pay Now
      </button>
      
      <PaymentForm
        storeId="your-store-id"
        amount={5000}
        currency="NGN"
        description="Product Purchase"
        walletAddress="0x1234567890abcdef1234567890abcdef12345678"
        redirectUrl="https://your-store.com/success"
        onSuccess={(data) => console.log('Payment successful:', data)}
        onError={(error) => console.error('Payment failed:', error)}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
```

### Props

The `PaymentForm` component accepts the following props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `storeId` | string | Yes | Your BananaCrystal store ID |
| `amount` | number | Yes | The payment amount in the specified currency |
| `currency` | string | Yes | The currency code (e.g., "NGN", "USD") |
| `description` | string | Yes | Description of the payment |
| `walletAddress` | string | Yes | Your USDT wallet address on the Polygon network |
| `redirectUrl` | string | No | URL to redirect after successful payment |
| `onSuccess` | function | No | Callback function called on successful payment |
| `onError` | function | No | Callback function called on payment error |
| `isOpen` | boolean | No | Controls whether the payment modal is open or closed |
| `onClose` | function | No | Callback function called when the user closes the modal |

### Fee Calculation

The package automatically calculates a 1.99% fee on all payments.

### Styling

The component uses Tailwind CSS classes for styling. You can customize the appearance by overriding these classes in your application.

## Browser Compatibility

This package is designed to work in both Node.js and browser environments. It includes three different bundle formats:

1. **CommonJS** (index.js) - For Node.js environments
2. **ES Modules** (index.esm.js) - For modern bundlers
3. **UMD** (index.browser.js) - For direct browser use

## Utility Functions

The package also exports several utility functions:

```jsx
import { 
  formatCurrency, 
  fetchExchangeRate, 
  convertToUsd, 
  calculateFee 
} from 'banana-crystal-payment';

// Format a number as currency
formatCurrency(1000); // "1,000.00"

// Calculate the fee for a payment amount (1.99%)
calculateFee(1000); // 19.9

// Fetch exchange rate for a currency to USD (async)
fetchExchangeRate("NGN").then(rate => console.log(rate));

// Convert an amount from a specific currency to USD (async)
convertToUsd(5000, "NGN").then(usdAmount => console.log(usdAmount));
```

## Constants

The package exports constants for country codes and currencies:

```jsx
import { COUNTRY_CODES, CURRENCIES, FEE_PERCENTAGE } from 'banana-crystal-payment';

console.log(FEE_PERCENTAGE); // 0.0199 (1.99%)
```

## Example Implementation

Here's a complete example of how to integrate the payment form as a modal in a React application:

```jsx
import React, { useState } from 'react';
import { PaymentForm, CURRENCIES } from 'banana-crystal-payment';

function PaymentPage() {
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
    setIsModalOpen(false);
    // Handle successful payment
  };

  const handleError = (error) => {
    console.error('Payment failed:', error);
    // Handle payment error
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      
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

export default PaymentPage;
```

## License

MIT
