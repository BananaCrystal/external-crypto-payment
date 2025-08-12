"use client";

import { useState } from "react";

interface ExistingAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoAccount: () => void;
  onHasAccount: () => void;
}

export const ExistingAccountModal: React.FC<ExistingAccountModalProps> = ({
  isOpen,
  onClose,
  onNoAccount,
  onHasAccount,
}) => {
  if (!isOpen) return null;

  const handleYesClick = () => {
    // Redirect to the BananaCrystal app for existing users
    window.location.href = "https://app.bananacrystal.com/cards/requests/new";
  };

  const handleNoClick = () => {
    onNoAccount();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Check
          </h2>
          <p className="text-gray-600">
            Do you already have an account with BananaCrystal?
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-blue-800 text-sm font-medium">
                  Existing Users
                </p>
                <p className="text-blue-700 text-sm">
                  If you already have a BananaCrystal account, we'll redirect you to your dashboard to complete the payment.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-green-800 text-sm font-medium">
                  New Users
                </p>
                <p className="text-green-700 text-sm">
                  If you're new to BananaCrystal, continue here to create an account and complete your payment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleYesClick}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-purple-700 transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Yes, I have an account
          </button>
          
          <button
            onClick={handleNoClick}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-gray-200 transform hover:scale-[1.01] active:scale-[0.99]"
          >
            No, I'm new to BananaCrystal
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
