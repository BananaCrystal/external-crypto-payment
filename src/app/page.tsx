'use client';

import { StoreIntegration } from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">
            USDT Payment Integration
          </h1>
          <p className="text-lg text-gray-600">
            Generate payment links for your store
          </p>
        </div>

        <StoreIntegration />
      </div>
    </div>
  );
}
