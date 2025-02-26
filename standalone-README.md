# Standalone Payment Form

This is a standalone React component for integrating USDT payments with BananaCrystal. It's designed to work with any React framework, including Next.js (both App Router and Pages Router).

## Features

- Responsive modal payment form with customizable positioning and sizing
- Themeable design with customizable colors
- Automatic fee calculation (1.99%)
- Currency conversion to USD
- Built-in form validation
- Session timeout handling
- Success and error notifications
- Accessibility features (keyboard navigation, screen reader support)
- Mobile-friendly design

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
| `modalPosition` | string | No | Position of the modal: 'top', 'center' (default), or 'bottom' |
| `modalSize` | string | No | Size of the modal: 'small', 'default', 'large', or 'full' |
| `theme` | object | No | Custom theme options (see below) |

## Customization

### Modal Position

Control where the modal appears on the screen:

```jsx
<StandalonePaymentForm
  // ... other props
  modalPosition="top" // 'top', 'center' (default), or 'bottom'
/>
```

### Modal Size

Adjust the width of the modal:

```jsx
<StandalonePaymentForm
  // ... other props
  modalSize="large" // 'small', 'default', 'large', or 'full'
/>
```

### Custom Theming

Customize the colors used in the modal:

```jsx
<StandalonePaymentForm
  // ... other props
  theme={{
    primaryColor: "blue-600", // Primary color for buttons and accents
    secondaryColor: "gray-100", // Background color for info sections
    textColor: "gray-800", // Main text color
    backgroundColor: "white", // Modal background color
  }}
/>
```

## User Interaction

The modal includes several user-friendly features:

- Close by clicking outside the modal
- Close using the escape key
- Animated transitions for a smooth user experience
- Responsive design that works on all device sizes

## Styling

The component includes all necessary styles and animations. It uses utility classes similar to Tailwind CSS. If you're using Tailwind CSS in your project, you don't need to do anything extra. If you're not using Tailwind CSS, the component will still work as it includes all the necessary styles internally.

## Important Notes

1. When using with Next.js App Router, always add the "use client" directive at the top of your component file.
2. The component automatically calculates a 1.99% fee on all payments.
3. The component includes a 30-minute countdown timer for the payment session.
4. The component handles form validation and displays error messages.
5. The component displays success and error notifications.
6. The component is fully responsive and works on all device sizes.
7. The component is accessible and supports keyboard navigation.
