# External Crypto Payment

This repository provides solutions for integrating USDT payments with BananaCrystal in React applications. It offers two implementation options:

1. **NPM Package**: A fully-featured React component library
2. **Standalone Implementation**: A self-contained component that can be directly copied into your project

## NPM Package: banana-crystal-payment

A React component library for integrating USDT payments with BananaCrystal.

### Installation

```bash
npm install banana-crystal-payment react react-dom
# or
yarn add banana-crystal-payment react react-dom
```

### Usage

```jsx
import React, { useState } from 'react';
import { PaymentForm } from 'banana-crystal-payment';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Open Payment Form
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
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

### Features

- Responsive modal payment form
- Customizable positioning and sizing
- Themeable design
- Automatic fee calculation (1.99%)
- Currency conversion to USD
- Form validation
- Session timeout handling
- Success and error notifications

### Advanced Customization

The modal can be customized with various options:

```jsx
<PaymentForm
  // Required props
  storeId="your-store-id"
  amount={5000}
  currency="NGN"
  description="Product Purchase"
  walletAddress="0x1234567890abcdef1234567890abcdef12345678"
  
  // Optional props
  redirectUrl="https://your-store.com/success"
  onSuccess={(data) => console.log('Payment successful:', data)}
  onError={(error) => console.error('Payment failed:', error)}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  
  // Customization options
  modalPosition="center" // 'top', 'center' (default), or 'bottom'
  modalSize="default" // 'small', 'default', 'large', or 'full'
  theme={{
    primaryColor: "blue-600", // Primary color for buttons and accents
    secondaryColor: "gray-100", // Background color for info sections
    textColor: "gray-800", // Main text color
    backgroundColor: "white", // Modal background color
  }}
/>
```

For more details, see the [full documentation](./banana-crystal-payment/README.md).

## Standalone Implementation

If you prefer not to add a dependency to your project, you can use the standalone implementation.

### How to Use

1. Copy these two files into your project:
   - [`standalone-payment-form.jsx`](./standalone-payment-form.jsx) - The main component
   - [`standalone-example.jsx`](./standalone-example.jsx) - An example of how to use the component

2. Use the component in your app:

```jsx
"use client"; // Add this if using Next.js App Router

import React, { useState } from 'react';
import StandalonePaymentForm from './path/to/standalone-payment-form';

export default function YourComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Open Payment Form
      </button>
      
      <StandalonePaymentForm
        storeId="your-store-id"
        amount={5000}
        currency="NGN"
        description="Product Purchase"
        walletAddress="0x1234567890abcdef1234567890abcdef12345678"
        redirectUrl="https://your-store.com/success"
        onSuccess={(data) => console.log('Payment successful:', data)}
        onError={(error) => console.error('Payment failed:', error)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

For more details on the standalone implementation, see the [standalone documentation](./standalone-README.md).

## Key Differences Between Implementations

| Feature | NPM Package | Standalone |
|---------|------------|------------|
| Installation | Requires npm install | Copy-paste files |
| Dependencies | React, React DOM | None (includes all code) |
| Customization | Extensive theming options | Basic styling |
| Bundle Size | Optimized | Includes all code inline |
| Updates | Via npm update | Manual file updates |
| TypeScript | Full TypeScript support | JavaScript only |

## Which Should You Choose?

- **Use the NPM Package if:**
  - You want a maintained dependency with updates
  - You need TypeScript support
  - You want advanced customization options
  - You're building a larger application

- **Use the Standalone Implementation if:**
  - You want to avoid adding dependencies
  - You need to make custom modifications
  - You're building a simple application
  - You want full control over the code

## License

MIT
