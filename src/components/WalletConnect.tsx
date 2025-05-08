"use client";

import React, { useState, useEffect } from "react";

import {
  connectWallet,
  switchToPolygonNetwork,
  POLYGON_CHAIN_ID,
  POLYGON_MUMBAI_CHAIN_ID,
} from "@/helpers/walletHelpers";

// Declare ethereum property on window
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletConnectProps {
  onConnected: (address: string, signer: any) => void;
  onDisconnected: () => void;
  loading?: boolean;
  buttonClassName?: string;
}

export default function WalletConnect({
  onConnected,
  onDisconnected,
  loading = false,
  buttonClassName = "",
}: WalletConnectProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Check for existing wallet connection on component mount
  useEffect(() => {
    setMounted(true);

    // Check if user manually disconnected in a previous session
    const manuallyDisconnected =
      localStorage.getItem("walletManuallyDisconnected") === "true";

    // If user previously disconnected manually, don't auto-connect
    if (manuallyDisconnected) {
      console.log("User previously disconnected manually, not auto-connecting");
      return;
    }

    // Check if we have a saved connection
    const savedConnection = localStorage.getItem("walletConnected") === "true";

    if (savedConnection && typeof window !== "undefined" && window.ethereum) {
      console.log("Restoring previous wallet connection");

      // Auto-reconnect if we have a saved connection
      handleConnect().catch((err) => {
        console.error("Error auto-connecting wallet:", err);
        // Don't show error to user on auto-connect failure
      });
    }

    return () => {
      setMounted(false);
    };
  }, []);

  // Handle wallet connection
  const handleConnect = async () => {
    setConnecting(true);
    setError(null);

    try {
      // First check if window and ethereum are available
      if (typeof window === "undefined") {
        setError("Browser environment not available");
        setConnecting(false);
        return;
      }

      // Check if ethereum provider exists
      if (!window.ethereum) {
        setError(
          "No Ethereum wallet detected. Please install MetaMask or another wallet."
        );
        setConnecting(false);
        return; // Exit without calling disconnectWallet to prevent page refresh
      }

      // Connect using helper function
      try {
        const walletState = await connectWallet();

        if (!walletState.address || !walletState.signer) {
          setError(
            "Failed to connect. Please check your wallet and try again."
          );
          setConnecting(false);
          return; // Don't disconnect or refresh
        }

        // Check if on correct network
        if (
          walletState.chainId !== POLYGON_CHAIN_ID &&
          walletState.chainId !== POLYGON_MUMBAI_CHAIN_ID
        ) {
          setError("Please connect to Polygon network to continue");
          setIsCorrectNetwork(false);
          setConnecting(false);
          return; // Exit without disconnecting to prevent refresh
        }

        // At this point, connection is successful
        localStorage.setItem("walletConnected", "true");
        localStorage.removeItem("walletManuallyDisconnected");

        // Update state
        setWalletAddress(walletState.address);
        setIsCorrectNetwork(true);

        // Trigger the parent's callback if provided
        onConnected(walletState.address, walletState.signer);
      } catch (error: any) {
        console.error("Connection error:", error);
        setError(error.message || "Connection failed. Please try again.");
        setConnecting(false);
        return; // Don't disconnect on error
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      setError("Connection failed. Please try again.");
      setConnecting(false);
      // Don't call disconnectWallet here to prevent page refresh on error
    } finally {
      setConnecting(false);
    }
  };

  // Handle wallet disconnection
  const disconnectWallet = () => {
    console.log("Disconnecting wallet in WalletConnect component");

    // Update local state
    setWalletAddress(null);
    setIsCorrectNetwork(false);
    setError(null);

    // Clear storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("walletConnected");
      localStorage.setItem("walletManuallyDisconnected", "true");

      // Determine if this was an explicit disconnect (not an error)
      const wasExplicitDisconnect = true; // Since this is only called on explicit disconnect now

      // Notify parent component
      onDisconnected();

      if (wasExplicitDisconnect) {
        // Force reload for explicit disconnects to ensure clean state with MetaMask
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } else {
      // If window is not available, still call parent handler
      onDisconnected();
    }
  };

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const defaultButtonClass =
    "flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white bg-[#4c3f84] hover:bg-opacity-90 transition-all duration-200";
  const buttonClass = buttonClassName || defaultButtonClass;

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 p-3 rounded-lg mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {!walletAddress ? (
        <button
          type="button"
          onClick={handleConnect}
          disabled={connecting || loading}
          className={`${buttonClass} ${
            connecting || loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {connecting ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"
                fill="currentColor"
              />
            </svg>
          )}
          Connect Wallet
        </button>
      ) : (
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg border border-purple-200 mb-2">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  isCorrectNetwork ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-gray-800 font-medium">
                {formatAddress(walletAddress)}
              </span>
            </div>
            <button
              type="button"
              onClick={disconnectWallet}
              className="text-sm text-red-600 hover:text-red-800"
              disabled={loading}
            >
              Disconnect
            </button>
          </div>

          {!isCorrectNetwork && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-sm flex items-center">
                <span className="mr-1">⚠️</span> Please switch to Polygon/MATIC
                network
              </p>
              <button
                type="button"
                onClick={async () => {
                  await switchToPolygonNetwork(window.ethereum);
                }}
                className="mt-2 bg-yellow-100 text-yellow-800 px-3 py-1 text-sm rounded-md hover:bg-yellow-200"
                disabled={loading}
              >
                Switch Network
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
