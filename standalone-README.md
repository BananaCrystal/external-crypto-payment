# Standalone Payment Form

This is a standalone React component for integrating USDT payments with BananaCrystal. It's designed to work with any React framework, including Next.js (both App Router and Pages Router).

## Features

- Modal payment form with multi-step process
- Automatic fee calculation (1.99%)
- Currency conversion to USD
- Responsive design with animations
- Built-in form validation
- Session timeout handling
- Success and error notifications

## How to Use

### Step 1: Copy the Component Files

Copy these two files into your project:
- `standalone-payment-form.jsx` - The main component
- `standalone-example.jsx` - An example of how to use the component

### Step 2: Use the Component in Your App

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

## Props

The `StandalonePaymentForm` component accepts the following props:

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

## Styling

The component includes all necessary styles and animations. It uses utility classes similar to Tailwind CSS. If you're using Tailwind CSS in your project, you don't need to do anything extra. If you're not using Tailwind CSS, the component will still work as it includes all the necessary styles internally.

## Important Notes

1. When using with Next.js App Router, always add the "use client" directive at the top of your component file.
2. The component automatically calculates a 1.99% fee on all payments.
3. The component includes a 30-minute countdown timer for the payment session.
4. The component handles form validation and displays error messages.
5. The component displays success and error notifications.
